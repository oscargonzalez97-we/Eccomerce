import { Link } from "react-router-dom";

function HomePage() {
  return (
    <main className="home-page">

      {/* HERO */}

      <section className="home-hero">

        <div className="home-hero-content">

          <span className="home-eyebrow">
            PLATAFORMA DE COMERCIO ELECTRÓNICO
          </span>

          <h1>
            Todo lo que necesitas,
            <br />
            <span>en un solo lugar.</span>
          </h1>

          <p>
            Explora nuestro catálogo, administra tus compras
            y consulta tus pedidos desde una plataforma
            sencilla, rápida y segura.
          </p>

          <div className="home-hero-actions">

            <Link
              to="/productos"
              className="primary-button home-main-button"
            >
              Explorar productos
              <span>→</span>
            </Link>

            <Link
              to="/registro"
              className="secondary-button home-secondary-button"
            >
              Crear una cuenta
            </Link>

          </div>

        </div>

        <div className="home-hero-decoration">

          <div className="hero-circle hero-circle-one" />
          <div className="hero-circle hero-circle-two" />

          <div className="hero-shopping-card">

            <div className="hero-cart-icon">
              🛒
            </div>

            <div>

              <strong>
                Compra fácil
              </strong>

              <span>
                Productos disponibles
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* MÓDULOS */}

      <section className="home-modules">

        <div className="home-section-heading">

          <span className="home-eyebrow">
            EXPLORA LA PLATAFORMA
          </span>

          <h2>
            ¿Qué deseas hacer?
          </h2>

          <p>
            Accede rápidamente a las principales
            funciones de la plataforma.
          </p>

        </div>


        <div className="home-module-grid">


          {/* USUARIOS */}

          <article className="home-module-card users-card">

            <div className="module-icon">
              👤
            </div>

            <div className="module-content">

              <span className="module-label">
                CUENTA
              </span>

              <h3>
                Usuarios
              </h3>

              <p>
                Regístrate, inicia sesión y administra
                tu cuenta dentro de la plataforma.
              </p>

              <Link
                to="/registro"
                className="module-link"
              >
                Crear cuenta
                <span>→</span>
              </Link>

            </div>

          </article>


          {/* PRODUCTOS */}

          <article className="home-module-card products-card">

            <div className="module-icon">
              🛒
            </div>

            <div className="module-content">

              <span className="module-label">
                CATÁLOGO
              </span>

              <h3>
                Productos
              </h3>

              <p>
                Consulta nuestro catálogo y descubre
                los productos disponibles para comprar.
              </p>

              <Link
                to="/productos"
                className="module-link"
              >
                Ver catálogo
                <span>→</span>
              </Link>

            </div>

          </article>


          {/* PEDIDOS */}

          <article className="home-module-card orders-card">

            <div className="module-icon">
              📦
            </div>

            <div className="module-content">

              <span className="module-label">
                COMPRAS
              </span>

              <h3>
                Pedidos
              </h3>

              <p>
                Consulta tus pedidos y revisa el estado
                de tus compras realizadas.
              </p>

              <Link
                to="/pedidos"
                className="module-link"
              >
                Ver mis pedidos
                <span>→</span>
              </Link>

            </div>

          </article>


        </div>

      </section>


      {/* INFORMACIÓN */}

      <section className="home-info">

        <div className="home-info-item">

          <div className="info-number">
            01
          </div>

          <div>
            <strong>
              Explora
            </strong>

            <p>
              Consulta nuestro catálogo de productos.
            </p>
          </div>

        </div>


        <div className="home-info-item">

          <div className="info-number">
            02
          </div>

          <div>
            <strong>
              Regístrate
            </strong>

            <p>
              Crea tu cuenta para realizar compras.
            </p>
          </div>

        </div>


        <div className="home-info-item">

          <div className="info-number">
            03
          </div>

          <div>
            <strong>
              Compra
            </strong>

            <p>
              Realiza y consulta tus pedidos.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}

export default HomePage;