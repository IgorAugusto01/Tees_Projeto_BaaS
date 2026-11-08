
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../config";

function getTasksCollection() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  return collection(db, "users", user.uid, "tasks");
}

// Buscar tarefas
export async function getTasks() {
  const snapshot = await getDocs(getTasksCollection());

  return snapshot.docs.map((document) => ({
    id: document.id,
    title: document.data().title as string,
    completed: document.data().completed as boolean,
  }));
}

// Criar tarefa
export async function addTask(title: string) {
  const document = await addDoc(getTasksCollection(), {
    title,
    completed: false,
  });

  return {
    id: document.id,
    title,
    completed: false,
  };
}

// Atualizar tarefa
export async function updateTask(
  id: string,
  data: { title: string; completed: boolean }
) {
  const taskRef = doc(getTasksCollection(), id);

  await updateDoc(taskRef, data);
}

// Excluir tarefa
export async function deleteTask(id: string) {
  const taskRef = doc(getTasksCollection(), id);

  await deleteDoc(taskRef);
}
