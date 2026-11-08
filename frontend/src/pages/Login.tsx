import { useState } from "react";
import { api } from "../services/api";
import { loginUser as firebaseLogin } from "../services/firebase/auth/auth";

interface LoginProps {
  onLogin: () => void;
  onRegister: () => void;
  onBackToSelection: () => void;
  backend: "api" | "firebase";
}

function Login({ onLogin,
  onRegister,
  onBackToSelection,
  backend, }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (backend === "firebase") {
        await firebaseLogin(email, password);
      } else {
        const response = await api.post("/login", {
          email,
          password,
        });

        const token = response.data.access_token;
        localStorage.setItem("token", token);
      }

      onLogin();
    } catch (err) {
      setError("E-mail ou senha incorretos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-container">
      <button
  type="button"
  className="back-selection-button"
  onClick={onBackToSelection}
  title="Voltar à seleção de backend"
>
  <span>←</span>
  Voltar
</button>
      <article className="login-card">
        <h1>Bem-vindo de volta!</h1>
        <p>Entre com suas credenciais para continuar.</p>

        {error && (
          <p style={{ color: "#dc2626", fontSize: "14px", marginBottom: "15px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            onRegister();
          }}
        >
          Criar conta
        </a>
      </article>
    </main>
  );
}

export default Login;