import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token
    navigate('/'); // Redirige al login
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};

export default Dashboard;
