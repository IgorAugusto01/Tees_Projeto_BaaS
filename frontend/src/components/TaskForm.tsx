
import { useState } from "react";

interface TaskFormProps {
  onAddTask: (title: string) => void;
}

function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (title.trim() === "") return;

    onAddTask(title);
    setTitle("");
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Digite uma tarefa..."
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <button type="submit">
        Adicionar
      </button>
    </form>
  );
}

export default TaskForm;
