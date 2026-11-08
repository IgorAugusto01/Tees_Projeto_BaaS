
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BackendSelection from "./pages/BackendSelection";

import { api } from "./services/api";
import { auth } from "./services/firebase/config";
import { logoutUser } from "./services/firebase/auth/auth";

import {
  getTasks as getFirebaseTasks,
  addTask as addFirebaseTask,
  updateTask as updateFirebaseTask,
  deleteTask as deleteFirebaseTask,
} from "./services/firebase/tasks/tasks";

interface Task {
  id: number | string;
  user_id?: number;
  title: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [selectedBackend, setSelectedBackend] = useState<
    "api" | "firebase" | null
  >(null);

  // Verifica a autenticação conforme o backend selecionado
  useEffect(() => {
    if (selectedBackend === null) return;

    if (selectedBackend === "api") {
      const token = localStorage.getItem("token");

      if (token) {
        setIsLoggedIn(true);
        fetchTasks();
      } else {
        setIsLoggedIn(false);
      }

      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);

      if (user) {
        fetchTasks();
      } else {
        setTasks([]);
      }
    });

    return unsubscribe;
  }, [selectedBackend]);

  // Buscar tarefas
  async function fetchTasks() {
    setLoadingTasks(true);

    try {
      if (selectedBackend === "firebase") {
        const firebaseTasks = await getFirebaseTasks();
        setTasks(firebaseTasks);
      } else {
        const response = await api.get<Task[]>("/tasks");
        setTasks(response.data);
      }
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
    } finally {
      setLoadingTasks(false);
    }
  }

  // Criar tarefa
  async function addTask(title: string) {
    try {
      if (selectedBackend === "firebase") {
        const newTask = await addFirebaseTask(title);
        setTasks((previousTasks) => [...previousTasks, newTask]);
      } else {
        const response = await api.post<Task>("/tasks", { title });
        setTasks((previousTasks) => [...previousTasks, response.data]);
      }
    } catch (err) {
      console.error("Erro ao criar tarefa:", err);
    }
  }

  // Alterar status da tarefa
  async function toggleTask(id: number | string) {
    const taskToUpdate = tasks.find((task) => task.id === id);

    if (!taskToUpdate) return;

    const newCompletedStatus = !taskToUpdate.completed;

    try {
      if (selectedBackend === "firebase") {
        await updateFirebaseTask(id.toString(), {
          title: taskToUpdate.title,
          completed: newCompletedStatus,
        });
      } else {
        await api.put(`/tasks/${id}`, {
          title: taskToUpdate.title,
          completed: newCompletedStatus,
        });
      }

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === id
            ? { ...task, completed: newCompletedStatus }
            : task
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar status da tarefa:", err);
    }
  }

  // Editar tarefa
  async function editTask(id: number | string, newTitle: string) {
    const taskToUpdate = tasks.find((task) => task.id === id);

    if (!taskToUpdate) return;

    try {
      if (selectedBackend === "firebase") {
        await updateFirebaseTask(id.toString(), {
          title: newTitle,
          completed: taskToUpdate.completed,
        });
      } else {
        await api.put(`/tasks/${id}`, {
          title: newTitle,
          completed: taskToUpdate.completed,
        });
      }

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === id ? { ...task, title: newTitle } : task
        )
      );
    } catch (err) {
      console.error("Erro ao editar tarefa:", err);
    }
  }

  // Excluir tarefa
  async function deleteTask(id: number | string) {
    try {
      if (selectedBackend === "firebase") {
        await deleteFirebaseTask(id.toString());
      } else {
        await api.delete(`/tasks/${id}`);
      }

      setTasks((previousTasks) =>
        previousTasks.filter((task) => task.id !== id)
      );
    } catch (err) {
      console.error("Erro ao deletar tarefa:", err);
    }
  }

  // Sair da conta
  async function handleLogout() {
    try {
      if (selectedBackend === "firebase") {
        await logoutUser();
      } else {
        localStorage.removeItem("token");
      }

      setIsLoggedIn(false);
      setTasks([]);
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  }


  async function handleBackToSelection() {
  try {
    if (selectedBackend === "firebase") {
      await logoutUser();
    } else {
      localStorage.removeItem("token");
    }

    setTasks([]);
    setIsLoggedIn(false);
    setShowRegister(false);
    setSelectedBackend(null);
  } catch (err) {
    console.error("Erro ao voltar para seleção:", err);
  }
}

  if (selectedBackend === null) {
    return (
      <BackendSelection
        onSelect={(backend) => setSelectedBackend(backend)}
      />
    );
  }

  if (showRegister) {
    return (
      <Register
        backend={selectedBackend}
        onRegister={() => setShowRegister(false)}
      />
    );
  }

  if (!isLoggedIn) {
    return (
      <Login
        backend={selectedBackend}
        onBackToSelection={handleBackToSelection}
        onLogin={() => {
          setIsLoggedIn(true);

          if (selectedBackend === "api") {
            fetchTasks();
          }
        }}
        onRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <main className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Minha lista de tarefas</h1>

        <button
          onClick={handleLogout}
          style={{
            padding: "6px 12px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          Sair
        </button>
      </div>

     

      <TaskForm onAddTask={addTask} />

      {loadingTasks ? (
        <p className="empty-message">Carregando tarefas...</p>
      ) : (
        <TaskList
          tasks={tasks}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onEditTask={editTask}
        />
      )}
    </main>
  );
}

export default App;
