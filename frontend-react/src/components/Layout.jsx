// src/components/Layout.jsx
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import "../css/Layout.css";

export default function Layout({ children }) {
  const { logout } = useAuth();
  const location = useLocation();

  const [dashboardSummary, setDashboardSummary] = useState({ projects: [], totalUnits: 0 });
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [popupUnits, setPopupUnits] = useState(null);

  const navLinks = [
    { to: "/dashboard/client-unit", label: "Sala de ventas" },
    { to: "/dashboard/project-form", label: "Nuevo Proyecto" },
    { to: "/dashboard/projects", label: "Proyectos" },
    { to: "/dashboard/client-form", label: "Nuevo Cliente" },
    { to: "/dashboard/clients", label: "Clientes" },
    { to: "/dashboard/unit-form", label: "Nueva Unidad" },
    { to: "/dashboard/units", label: "Unidades" },
  ];

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setLoadingSummary(true);
      api.get("/proyectos", { params: { per_page: 10000 } })
        .then(res => {
          let projects = res.data.data || [];
          // Sumar unidades asociadas a todos los proyectos
          let totalUnits = 0;
          projects.forEach(p => {
            if (Array.isArray(p.unidades)) totalUnits += p.unidades.length;
            else if (typeof p.unidades_count === 'number') totalUnits += p.unidades_count;
          });
          // Ordenar proyectos por cantidad de unidades (descendente)
          projects = projects.slice().sort((a, b) => {
            const aCount = Array.isArray(a.unidades) ? a.unidades.length : (typeof a.unidades_count === 'number' ? a.unidades_count : 0);
            const bCount = Array.isArray(b.unidades) ? b.unidades.length : (typeof b.unidades_count === 'number' ? b.unidades_count : 0);
            return bCount - aCount;
          });
          setDashboardSummary({ projects, totalUnits });
        })
        .catch(() => setDashboardSummary({ projects: [], totalUnits: 0 }))
        .finally(() => setLoadingSummary(false));
    }
  }, [location.pathname]);

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
            <Link
              to="/dashboard"
              className={`px-3 py-1 rounded transition text-white text-sm font-semibold ${
                location.pathname === "/dashboard"
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              }`}
              style={{
                marginLeft: "30px",
                height: "28px",
                lineHeight: "20px",
                alignSelf: "center",
                textDecoration: "none",
                display: "inline-block",
                color: "#fff",
              }}
            >
              Dashboard
            </Link>
          </div>
          <h2
            className="text-xl font-bold text-center"
            style={{ marginTop: "10px" }}
          >
            Gestor real estate
          </h2>
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
          <div className="p-4 border-t border-gray-700">
            <button onClick={logout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {location.pathname === "/dashboard" && (
          <div style={{ marginTop: "1.0rem", marginBottom: "2rem" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#2563eb", marginBottom: "1.5rem", textAlign: "center" }}>
              ¡Hola! Aquí hay un resumen de tus proyectos y unidades.
            </div>
            <div className="dashboard-summary" style={{ maxWidth: 700, margin: "0 auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", padding: 20 }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: 5, color: "#1e293b", textAlign: "center" }}>Resumen de Proyectos</h3>
              {loadingSummary ? (
                <div style={{ textAlign: "center", color: "#888" }}>Cargando resumen...</div>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 32, fontWeight: 700, color: "#2563eb" }}>{dashboardSummary.projects.length}</div>
                      <div style={{ color: "#374151" }}>Proyectos registrados</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 32, fontWeight: 700, color: "#2563eb" }}>{dashboardSummary.totalUnits}</div>
                      <div style={{ color: "#374151" }}>Unidades asociadas</div>
                    </div>
                  </div>
                  <div style={{ maxHeight: 220, overflowY: "auto", borderTop: "1px solid #e5e7eb", paddingTop: 8 }}>
                    <table style={{ width: "100%", fontSize: 15 }}>
                      <thead>
                        <tr style={{ background: "#f3f4f6" }}>
                          <th style={{ textAlign: "left", padding: "6px 8px" }}>Proyecto</th>
                          <th style={{ textAlign: "center", padding: "6px 8px" }}>Unidades</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardSummary.projects.map((p) => (
                          <tr key={p.id}>
                            <td style={{ padding: "6px 8px" }}>{p.nombre}</td>
                            <td
                              style={{ textAlign: "center", padding: "6px 8px", cursor: Array.isArray(p.unidades) && p.unidades.length > 0 ? 'pointer' : 'default', position: 'relative' }}
                              title={Array.isArray(p.unidades) && p.unidades.length > 0 ? p.unidades.map(u => u.numero_unidad).join(', ') : ''}
                              onClick={() => {
                                if (Array.isArray(p.unidades) && p.unidades.length > 0) setPopupUnits({ nombre: p.nombre, unidades: p.unidades });
                              }}
                              onMouseEnter={e => {
                                if (Array.isArray(p.unidades) && p.unidades.length > 0) {
                                  e.currentTarget.style.background = '#e0e7ef';
                                }
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background = '';
                              }}
                            >
                              {Array.isArray(p.unidades) ? p.unidades.length : (typeof p.unidades_count === 'number' ? p.unidades_count : 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {popupUnits && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,41,59,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setPopupUnits(null)}>
                      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.13)', padding: 24, minWidth: 320, maxWidth: 400, maxHeight: 400, overflowY: 'auto', position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 12, color: '#2563eb', textAlign: 'center' }}>Unidades de {popupUnits.nombre}</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          {popupUnits.unidades.map(u => (
                            <li key={u.id} style={{ padding: '6px 0', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>{u.numero_unidad} - {u.tipo_unidad}</li>
                          ))}
                        </ul>
                        <button style={{ marginTop: 18, display: 'block', marginLeft: 'auto', marginRight: 'auto', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }} onClick={() => setPopupUnits(null)}>Cerrar</button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
