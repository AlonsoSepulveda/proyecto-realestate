// src/components/Layout.jsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Layout({ children }) {
  const { logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: "/dashboard/project-form", label: "Nuevo Proyecto" },
    { to: "/dashboard/projects", label: "Proyectos" },
    { to: "/dashboard/client-form", label: "Nuevo Cliente" },
    { to: "/dashboard/clients", label: "Clientes" },
    { to: "/dashboard/unit-form", label: "Nueva Unidad" },
    { to: "/dashboard/units", label: "Unidades" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar vertical */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-center space-x-2">
            <img
              src="/LogoProyectoRealEstate.png"
              alt="Logo"
              style={{ width: "50px", height: "50px" }}
            />
            <h1 className="text-xl font-bold text-center">
              Proyecto Real Estate
            </h1>
          </div>
        </div>
        <div className="p-4 border-t border-gray-700">
          <button onClick={logout} className="logout-btn">
            Cerrar sesión
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-4 py-2 rounded transition ${
                location.pathname === link.to
                  ? "bg-gray-700 font-semibold"
                  : "hover:bg-gray-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
