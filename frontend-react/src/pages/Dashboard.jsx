// src/pages/Dashboard.jsx
import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import ProjectList from '../components/ProjectList';
import ProjectForm from '../components/ProjectForm';
import ClientList from '../components/ClientList';
import ClientForm from '../components/ClientForm';
import UnitList from '../components/UnitList';
import UnitForm from '../components/UnitForm';

const Dashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/project-form" element={<ProjectForm />} />
        <Route path="/clients" element={<ClientList />} />
        <Route path="/client-form" element={<ClientForm />} />
        <Route path="/units" element={<UnitList />} />
        <Route path="/unit-form" element={<UnitForm />} />
      </Routes>
    </Layout>
  );
};

export default Dashboard;
