
interface BackendSelectionProps {
  onSelect: (backend: "api" | "firebase") => void;
}

function BackendSelection({ onSelect }: BackendSelectionProps) {
  return (
    <main className="login-container">
      <article className="login-card">
        <h1>Escolha o Backend</h1>
        <p>Selecione a tecnologia que deseja utilizar.</p>

        <div className="backend-options">
          <button
            className="backend-button api-button"
            onClick={() => onSelect("api")}
          >
            API tradicional
          </button>

          <button
            className="backend-button firebase-button"
            onClick={() => onSelect("firebase")}
          >
            <span className="firebase-icon">🔥</span>
            Firebase
          </button>
        </div>
      </article>
    </main>
  );
}

export default BackendSelection;
