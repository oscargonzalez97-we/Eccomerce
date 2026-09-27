import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import { authService } from "../../services/authService";

function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mostrarPassword, setMostrarPassword] =
    useState(false);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  function obtenerNivelPassword(): number {
    let nivel = 0;

    if (password.length >= 8) nivel++;
    if (/[A-Z]/.test(password)) nivel++;
    if (/[0-9]/.test(password)) nivel++;
    if (/[^A-Za-z0-9]/.test(password)) nivel++;

    return nivel;
  }

  const nivelPassword =
    obtenerNivelPassword();

  function textoPassword(): string {
    if (!password) return "Mínimo 8 caracteres";

    if (nivelPassword <= 1) {
      return "Contraseña débil";
    }

    if (nivelPassword === 2) {
      return "Contraseña media";
    }

    if (nivelPassword === 3) {
      return "Contraseña buena";
    }

    return "Contraseña segura";
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMensaje("");
    setError("");

    if (password.length < 8) {
      setError(
        "La contraseña debe tener al menos 8 caracteres."
      );
      return;
    }

    setCargando(true);

    try {
      const usuario =
        await authService.registrar({
          nombre,
          email,
          password,
          rol: "CLIENTE",
        });

      setMensaje(
        `¡Cuenta creada correctamente! Bienvenido, ${usuario.nombre}.`
      );

      setNombre("");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      setError(
        error.response?.data?.error ??
        "No fue posible registrar el usuario."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="auth-page">

      <div className="auth-layout">

        {/* PANEL VISUAL */}

        <section className="auth-showcase">

          <div className="auth-showcase-content">

            <span className="auth-eyebrow">
              ECcommerce
            </span>

            <h1>
              Tu próxima
              <br />
              <span>compra empieza aquí.</span>
            </h1>

            <p>
              Crea tu cuenta y disfruta de una
              experiencia de compra sencilla,
              rápida y segura.
            </p>

            <div className="auth-benefits">

              <div className="auth-benefit">
                <span>✓</span>
                <div>
                  <strong>
                    Catálogo completo
                  </strong>
                  <small>
                    Explora todos nuestros productos.
                  </small>
                </div>
              </div>

              <div className="auth-benefit">
                <span>✓</span>
                <div>
                  <strong>
                    Compra fácilmente
                  </strong>
                  <small>
                    Realiza tus pedidos desde tu cuenta.
                  </small>
                </div>
              </div>

              <div className="auth-benefit">
                <span>✓</span>
                <div>
                  <strong>
                    Control de pedidos
                  </strong>
                  <small>
                    Consulta el estado de tus compras.
                  </small>
                </div>
              </div>

            </div>

          </div>

          <div className="auth-decoration">
            🛒
          </div>

        </section>


        {/* FORMULARIO */}

        <section className="auth-card">

          <div className="auth-card-header">

            <div className="auth-mobile-logo">
              🛒
            </div>

            <span className="auth-card-label">
              CREAR CUENTA
            </span>

            <h2>
              Crea tu cuenta
            </h2>

            <p>
              Completa tus datos para comenzar.
            </p>

          </div>


          {mensaje && (
            <div className="auth-message auth-success">
              <span>✓</span>
              <div>
                {mensaje}
              </div>
            </div>
          )}


          {error && (
            <div className="auth-message auth-error">
              <span>!</span>
              <div>
                {error}
              </div>
            </div>
          )}


          <form
            onSubmit={handleSubmit}
            className="auth-form"
          >

            {/* NOMBRE */}

            <div className="auth-field">

              <label htmlFor="nombre">
                Nombre completo
              </label>

              <div className="auth-input-wrapper">

                <span className="auth-input-icon">
                  👤
                </span>

                <input
                  id="nombre"
                  type="text"
                  placeholder="Nombre Completo"
                  value={nombre}
                  onChange={(event) =>
                    setNombre(event.target.value)
                  }
                  required
                  minLength={2}
                  autoComplete="name"
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="auth-field">

              <label htmlFor="email">
                Correo electrónico
              </label>

              <div className="auth-input-wrapper">

                <span className="auth-input-icon">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                  autoComplete="email"
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="auth-field">

              <div className="auth-label-row">

                <label htmlFor="password">
                  Contraseña
                </label>

                <span>
                  8+ caracteres
                </span>

              </div>

              <div className="auth-input-wrapper">

                <span className="auth-input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type={
                    mostrarPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                  minLength={8}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setMostrarPassword(
                      !mostrarPassword
                    )
                  }
                  aria-label={
                    mostrarPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {mostrarPassword ? "◉" : "◌"}
                </button>

              </div>


              {/* PASSWORD STRENGTH */}

              <div className="password-strength">

                <div className="strength-bars">

                  {[1, 2, 3, 4].map(
                    (barra) => (
                      <span
                        key={barra}
                        className={
                          barra <= nivelPassword
                            ? "active"
                            : ""
                        }
                      />
                    )
                  )}

                </div>

                <span
                  className={
                    nivelPassword >= 3
                      ? "strength-good"
                      : ""
                  }
                >
                  {textoPassword()}
                </span>

              </div>

            </div>


            {/* BOTÓN */}

            <button
              type="submit"
              className="auth-submit"
              disabled={cargando}
            >

              {cargando ? (
                <>
                  <span className="auth-spinner" />
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear mi cuenta
                  <span>→</span>
                </>
              )}

            </button>

          </form>


          {/* LOGIN */}

          <div className="auth-footer">

            <span>
              ¿Ya tienes una cuenta?
            </span>

            <Link to="/login">
              Iniciar sesión
            </Link>

          </div>

        </section>

      </div>

    </main>
  );
}

export default RegisterPage; 