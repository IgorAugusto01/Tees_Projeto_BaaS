import axios from "axios";

// Criamos uma instância do axios apontando para a URL base do nosso FastAPI
export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Interceptor: antes de qualquer requisição sair, ele verifica se existe um token salvo
// e o adiciona automaticamente no cabeçalho Authorization (Bearer Token).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});