from app.database import get_connection


def create_task(user_id: int, title: str) -> dict:
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO tasks (user_id, title, completed) VALUES (%s, %s, FALSE)",
                (user_id, title),
            )
            task_id = cursor.lastrowid
        connection.commit()
    finally:
        connection.close()

    return {"id": task_id, "user_id": user_id, "title": title, "completed": False}


def get_tasks_by_user(user_id: int) -> list:
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT id, user_id, title, completed FROM tasks WHERE user_id = %s",
                (user_id,),
            )
            rows = cursor.fetchall()
    finally:
        connection.close()

    tasks = []
    for row in rows:
        tasks.append({
            "id": row[0],
            "user_id": row[1],
            "title": row[2],
            "completed": bool(row[3])
        })
    return tasks


def update_task(task_id: int, user_id: int, title: str, completed: bool) -> bool:
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Atualiza apenas se a tarefa pertencer ao user_id (isolamento de segurança)
            cursor.execute(
                "UPDATE tasks SET title = %s, completed = %s WHERE id = %s AND user_id = %s",
                (title, completed, task_id, user_id),
            )
            rows_affected = cursor.rowcount
        connection.commit()
    finally:
        connection.close()
    
    # Retorna True se encontrou e atualizou, False caso contrário
    return rows_affected > 0


def delete_task(task_id: int, user_id: int) -> bool:
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Deleta apenas se a tarefa pertencer ao user_id
            cursor.execute(
                "DELETE FROM tasks WHERE id = %s AND user_id = %s",
                (task_id, user_id),
            )
            rows_affected = cursor.rowcount
        connection.commit()
    finally:
        connection.close()
        
    return rows_affected > 0