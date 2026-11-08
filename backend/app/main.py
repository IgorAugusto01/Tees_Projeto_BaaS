from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from pymysql.err import IntegrityError

from app.crud.users import create_user, get_user_by_email
from app.crud.tasks import create_task, get_tasks_by_user, update_task, delete_task
from app.schemas.token import Token, UserLogin
from app.schemas.user import UserCreate, UserResponse
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.security import (
    create_access_token, 
    hash_password, 
    verify_password, 
    get_current_user
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "API funcionando"}


@app.post("/register", response_model=UserResponse)
def register(user: UserCreate):
    password_hash = hash_password(user.password)
    try:
        user_id = create_user(user.email, password_hash)
    except IntegrityError:
        raise HTTPException(status_code=409, detail="E-mail já cadastrado")
    return {"id": user_id, "email": user.email}


@app.post("/login", response_model=Token)
def login(user_credentials: UserLogin):
    db_user = get_user_by_email(user_credentials.email)
    
    if not db_user or not verify_password(user_credentials.password, db_user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": db_user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/me")
def read_users_me(current_user_email: str = Depends(get_current_user)):
    return {"message": "Você está autenticado!", "email": current_user_email}


@app.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_new_task(task: TaskCreate, current_user_email: str = Depends(get_current_user)):
    db_user = get_user_by_email(current_user_email)
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    new_task = create_task(user_id=db_user["id"], title=task.title)
    return new_task


@app.get("/tasks", response_model=list[TaskResponse])
def list_user_tasks(current_user_email: str = Depends(get_current_user)):
    db_user = get_user_by_email(current_user_email)
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    tasks = get_tasks_by_user(user_id=db_user["id"])
    return tasks


@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_existing_task(task_id: int, task_data: TaskUpdate, current_user_email: str = Depends(get_current_user)):
    db_user = get_user_by_email(current_user_email)
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    success = update_task(
        task_id=task_id, 
        user_id=db_user["id"], 
        title=task_data.title, 
        completed=task_data.completed
    )
    
    if not success:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada ou não pertence a você")
    
    return {
        "id": task_id,
        "user_id": db_user["id"],
        "title": task_data.title,
        "completed": task_data.completed
    }


@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_task(task_id: int, current_user_email: str = Depends(get_current_user)):
    db_user = get_user_by_email(current_user_email)
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    success = delete_task(task_id=task_id, user_id=db_user["id"])
    
    if not success:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada ou não pertence a você")
    
    return None