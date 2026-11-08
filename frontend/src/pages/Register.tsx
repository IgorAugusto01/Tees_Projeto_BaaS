
import { useState } from "react";
import { api } from "../services/api";
import { registerUser as firebaseRegister } from "../services/firebase/auth/auth";

interface RegisterProps {
  onRegister: () => void;
  backend: "api" | "firebase";
}

function Register({ onRegister, backend }: RegisterProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      if (backend === "firebase") {
        await firebaseRegister(email, password);
      } else {
        await api.post("/register", {
          email,
          password,
        });
      }

      setSuccess(true);
    } catch (err) {
      setError("Não foi possível realizar o cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-container">
      <article className="login-card">
        {success ? (
          <>
            <h1>Cadastro realizado!</h1>
            <p>Sua conta foi criada com sucesso.</p>

            <button onClick={onRegister}>
              Ir para o login
            </button>
          </>
        ) : (
          <>
            <h1>Criar conta</h1>
            <p>Preencha os dados para começar.</p>

            {error && (
              <p style={{
                color: "#dc2626",
                fontSize: "14px",
                marginBottom: "15px"
              }}>
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

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar senha</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Cadastrando..." : "Cadastrar"}
              </button>
            </form>

            <div className="register-link">
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  onRegister();
                }}
              >
                Já possui uma conta? Fazer login
              </a>
            </div>
          </>
        )}
      </article>
    </main>
  );
}

export default Register;