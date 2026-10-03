import {
  useState,
} from "react";

import type { FormEvent } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";

function LoginPage() {
  const navigate = useNavigate();

  const { iniciarSesion } =
    useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [cargando, setCargando] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setCargando(true);

    try {
    const respuesta =
      await authService.iniciarSesion({
        email,
        password,
      });
    
    iniciarSesion(
      respuesta.usuario,
      respuesta.token
    );

    navigate("/");
    
    } catch (error: any) {
      setError(
        error.response?.data?.error ??
        "Correo o contraseña incorrectos."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="auth-page">

      <div className="auth-card">

        <div className="auth-icon">
          🛒
        </div>

        <h1>
          Bienvenido
        </h1>

        <p className="auth-description">
          Inicia sesión para continuar con
          tus compras.
        </p>

        <form
          className="form"
          onSubmit={handleSubmit}
        >

          <label>
            Correo electrónico

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="correo@ejemplo.com"
              required
            />
          </label>

          <label>
            Contraseña

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="••••••••"
              required
            />
          </label>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={cargando}
          >
            {cargando
              ? "Iniciando sesión..."
              : "Iniciar sesión"}
          </button>

        </form>

        <div className="auth-register">

          <span>
            ¿No tienes una cuenta?
          </span>

          <Link to="/registro">
            Crear cuenta
          </Link>

        </div>

      </div>

    </section>
  );
}

export default LoginPage;
