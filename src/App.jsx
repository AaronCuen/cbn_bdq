import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home.jsx';
import ComplaintForm from './pages/formQuejas.jsx';

function App() {
  return (
    <Routes>
      {/* Ruta raíz te manda al login */}
      <Route path="/" element={<Login />} />

      {/* Otras rutas */}
      <Route path="/home" element={<Home />} />
      <Route path="/formulario" element={<ComplaintForm />} />
    </Routes>
  );
}

export default App;
