import { useEffect, useState } from "react";

import { authService } from "../../services/authService";

import type {
  Usuario,
  RolUsuario,
} from "../../types/usuario";

function AdminUsuariosPage() {
  const [usuarios, setUsuarios] =
    useState<Usuario[]>([]);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] =
    useState<RolUsuario>("CLIENTE");

  const [editandoId, setEditandoId] =
    useState<number | null>(null);

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [mensaje, setMensaje] =
    useState("");

  const [error, setError] =
    useState("");

  async function cargarUsuarios() {
    try {
      setCargando(true);
      setError("");

      const datos =
        await authService.obtenerUsuarios();

      setUsuarios(datos);
    } catch (error: any) {
      setError(
        error.response?.data?.error ??
          "No fue posible cargar los usuarios."
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarUsuarios();
  }, []);

  function limpiarFormulario() {
    setNombre("");
    setEmail("");
    setPassword("");
    setRol("CLIENTE");
    setEditandoId(null);
    setMensaje("");
    setError("");
  }

  function editarUsuario(usuario: Usuario) {
    setEditandoId(usuario.id);
    setNombre(usuario.nombre);
    setEmail(usuario.email);
    setRol(usuario.rol);
    setPassword("");
    setMensaje("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function guardarUsuario(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setGuardando(true);
      setMensaje("");
      setError("");

      if (editandoId === null) {
        await authService.registrar({
          nombre,
          email,
          password,
          rol,
        });

        setMensaje(
          "Usuario creado correctamente."
        );
      } else {
        await authService.actualizarUsuario(
          editandoId,
          {
            nombre,
            email,
            rol,
          }
        );

        setMensaje(
          "Usuario actualizado correctamente."
        );
      }

      limpiarFormulario();
      await cargarUsuarios();
    } catch (error: any) {
      setError(
        error.response?.data?.error ??
          "No fue posible guardar el usuario."
      );
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarUsuario(
    id: number
  ) {
    const confirmar =
      window.confirm(
        "¿Deseas eliminar este usuario?"
      );

    if (!confirmar) return;

    try {
      setError("");
      setMensaje("");

      await authService.eliminarUsuario(id);

      setMensaje(
        "Usuario eliminado correctamente."
      );

      await cargarUsuarios();
    } catch (error: any) {
      setError(
        error.response?.data?.error ??
          "No fue posible eliminar el usuario."
      );
    }
  }

  return (
    <section className="admin-page">

      {/* HEADER */}

      <div className="admin-page-header">

        <div>
          <span className="admin-label">
            ADMINISTRACIÓN
          </span>

          <h1>
            Usuarios
          </h1>

          <p>
            Administra las cuentas y permisos
            de los usuarios de la plataforma.
          </p>
        </div>

        <div className="admin-header-actions">

          <button
            className="admin-button secondary"
            onClick={cargarUsuarios}
          >
            ↻ Actualizar
          </button>

          <button
            className="admin-button primary"
            onClick={limpiarFormulario}
          >
            + Nuevo usuario
          </button>

        </div>

      </div>

      {/* MENSAJES */}

      {mensaje && (
        <div className="admin-alert success">
          ✓ {mensaje}
        </div>
      )}

      {error && (
        <div className="admin-alert error">
          {error}
        </div>
      )}

      {/* CONTENIDO */}

      <div className="admin-two-columns">

        {/* FORMULARIO */}

        <section className="admin-form-card">

          <div className="admin-card-header">

            <div>
              <span className="admin-label">
                {editandoId === null
                  ? "NUEVO REGISTRO"
                  : "EDITANDO"}
              </span>

              <h2>
                {editandoId === null
                  ? "Crear usuario"
                  : "Editar usuario"}
              </h2>
            </div>

            {editandoId !== null && (
              <button
                className="admin-close-button"
                onClick={limpiarFormulario}
              >
                ×
              </button>
            )}

          </div>

          <form
            className="admin-form"
            onSubmit={guardarUsuario}
          >

            <label>
              Nombre completo

              <input
                type="text"
                value={nombre}
                onChange={(event) =>
                  setNombre(event.target.value)
                }
                placeholder="Ej. Juan Pérez"
                required
                minLength={2}
              />
            </label>

            <label>
              Correo electrónico

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="usuario@correo.com"
                required
              />
            </label>

            {editandoId === null && (
              <label>
                Contraseña

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
                />
              </label>
            )}

            <label>
              Rol

              <select
                value={rol}
                onChange={(event) =>
                  setRol(
                    event.target.value as RolUsuario
                  )
                }
              >
                <option value="CLIENTE">
                  Cliente
                </option>

                <option value="ADMIN">
                  Administrador
                </option>
              </select>
            </label>

            <div className="admin-form-actions">

              <button
                type="submit"
                className="admin-button primary full"
                disabled={guardando}
              >
                {guardando
                  ? "Guardando..."
                  : editandoId === null
                    ? "Crear usuario"
                    : "Guardar cambios"}
              </button>

              {editandoId !== null && (
                <button
                  type="button"
                  className="admin-button secondary full"
                  onClick={limpiarFormulario}
                >
                  Cancelar
                </button>
              )}

            </div>

          </form>

        </section>

        {/* LISTADO */}

        <section className="admin-list-card">

          <div className="admin-card-header">

            <div>
              <span className="admin-label">
                REGISTROS
              </span>

              <h2>
                Usuarios registrados
              </h2>
            </div>

            <span className="admin-count">
              {usuarios.length}
            </span>

          </div>

          {cargando ? (

            <div className="admin-loading">
              Cargando usuarios...
            </div>

          ) : usuarios.length === 0 ? (

            <div className="admin-empty">
              <div>👥</div>
              <h3>
                No hay usuarios
              </h3>
              <p>
                Crea el primer usuario desde
                el formulario.
              </p>
            </div>

          ) : (

            <div className="admin-user-list">

              {usuarios.map((usuario) => (

                <article
                  className="admin-user-item"
                  key={usuario.id}
                >

                  <div className="admin-user-avatar">
                    {usuario.nombre
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="admin-user-info">

                    <strong>
                      {usuario.nombre}
                    </strong>

                    <span>
                      {usuario.email}
                    </span>

                    <small>
                      ID #{usuario.id}
                    </small>

                  </div>

                  <span
                    className={
                      usuario.rol === "ADMIN"
                        ? "admin-role admin"
                        : "admin-role"
                    }
                  >
                    {usuario.rol}
                  </span>

                  <div className="admin-item-actions">

                    <button
                      className="admin-icon-button edit"
                      onClick={() =>
                        editarUsuario(usuario)
                      }
                      title="Editar usuario"
                    >
                      ✎
                    </button>

                    <button
                      className="admin-icon-button delete"
                      onClick={() =>
                        eliminarUsuario(
                          usuario.id
                        )
                      }
                      title="Eliminar usuario"
                    >
                      🗑
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </div>

    </section>
  );
}

export default AdminUsuariosPage;