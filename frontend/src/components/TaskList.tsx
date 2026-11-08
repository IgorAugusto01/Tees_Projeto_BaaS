
import { useState } from "react";

interface Task {
  id: number | string;
  title: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: number | string) => void;
  onDeleteTask: (id: number | string) => void;
  onEditTask: (id: number | string, newTitle: string) => void;
}

function TaskList({
  tasks,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}: TaskListProps) {
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const percentage =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  function startEditing(task: Task) {
    setEditingId(task.id);
    setEditedTitle(task.title);
  }

  function saveEditing(id: number | string) {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === "") return;

    onEditTask(id, trimmedTitle);
    setEditingId(null);
    setEditedTitle("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditedTitle("");
  }

  if (tasks.length === 0) {
    return (
      <p className="empty-message">
        Nenhuma tarefa cadastrada.
      </p>
    );
  }

  return (
    <>
      <div className="task-summary">
        <span>
          Concluídas: {completedTasks} de {tasks.length}
        </span>

        <span>{percentage}%</span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li className="task-item" key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleTask(task.id)}
            />

            {editingId === task.id ? (
              <>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(event) =>
                    setEditedTitle(event.target.value)
                  }
                  autoFocus
                />

                <button
                  className="save-button"
                  onClick={() => saveEditing(task.id)}
                >
                  Salvar
                </button>

                <button
                  className="cancel-button"
                  onClick={cancelEditing}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span className={task.completed ? "completed" : ""}>
                  {task.title}
                </span>

                <button
                  className="edit-button"
                  onClick={() => startEditing(task)}
                >
                  Alterar
                </button>

                <button
                  className="delete-button"
                  onClick={() => onDeleteTask(task.id)}
                >
                  Excluir
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export default TaskList;
