import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home.jsx';
import ComplaintForm from './pages/formQuejas.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

function App() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/" element={<Login />} />

      {/* Ruta pública para el formulario */}
      <Route path="/formulario" element={<ComplaintForm />} />

      {/* Ruta protegida */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;

