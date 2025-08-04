import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LuLogOut } from "react-icons/lu";



const Home = () => {
  const [quejas, setQuejas] = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [seleccionada, setSeleccionada] = useState(null);
  const [mostrarImagen, setMostrarImagen] = useState(false);
  const [mostrarFirma, setMostrarFirma] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmar = window.confirm('¿Seguro que quieres cerrar sesión?');
    if (confirmar) {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const fetchQuejas = async () => {
    try {
      const response = await axios.get('http://vog40wk0ok8k0wc0oswss440.31.97.136.112.sslip.io/quejas-filtradas', {
        params: {
          comentario: tipoFiltro,
          fecha: fechaFiltro
        }
      });
      setQuejas(response.data);
    } catch (error) {
      console.error('❌ Error al obtener las quejas:', error);
    }
  };

  useEffect(() => {
    fetchQuejas();
  }, [tipoFiltro, fechaFiltro]);

  const limpiarFiltros = () => {
    setTipoFiltro('');
    setFechaFiltro('');
  };

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Panel</h2>
        <ul style={styles.navList}>
          <li style={styles.navItem} onClick={() => navigate(0)}>Dashboard</li>
          <li style={styles.navItem} onClick={() => navigate('/formulario')}>Formulario</li>
          <li style={styles.navItem}>Usuarios</li>
          <li style={styles.navItem}>Ajustes</li>
          <li style={styles.navItem} onClick={handleLogout}>
            <LuLogOut style={{ marginRight: 8 }} />
            Cerrar sesión
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.contentBox}>
          <h2 style={styles.heading}>Panel de Administrador</h2>

          {/* Filtros */}
          <div style={styles.filterSection}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Tipo de comentario</label>
              <select
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
                style={styles.input}
              >
                <option value="">Todos</option>
                <option value="Reclamo">Reclamo</option>
                <option value="Sugerencia">Sugerencia</option>
                <option value="Felicitación">Felicitación</option>
                <option value="Queja">Queja</option>
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Filtrar por fecha</label>
              <input
                type="date"
                value={fechaFiltro}
                onChange={(e) => setFechaFiltro(e.target.value)}
                style={styles.input}
              />
            </div>
            <button style={styles.buttonClear} onClick={limpiarFiltros}>Limpiar filtros</button>
          </div>

          {/* Tabla */}
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Comentario</th>
                <th style={styles.th}>Área</th>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {quejas.length === 0 ? (
                <tr>
                  <td colSpan="5" style={styles.noResults}>No hay resultados</td>
                </tr>
              ) : (
                quejas.map((q) => (
                  <React.Fragment key={q.id}>
                    <tr>
                      <td style={styles.td}>{q.apellido || 'Anonimo'}</td>
                      <td style={styles.td}>{q.comentario}</td>
                      <td style={{ ...styles.td, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{q.area}</td>
                      <td style={styles.td}>{new Date(q.fechaQueja).toLocaleDateString()}</td>
                      <td style={styles.td}>
                        <button
                          style={styles.buttonView}
                          onClick={() => setSeleccionada(seleccionada?.id === q.id ? null : q)}
                        >
                          {seleccionada?.id === q.id ? 'Cerrar' : 'Ver más'}
                        </button>
                      </td>
                    </tr>

                    {seleccionada?.id === q.id && (
                      <tr>
                        <td colSpan="5">
                          <div style={styles.detailBox}>
                            <h3 style={styles.detailTitle}>Detalles de la Queja</h3>
                            <p><strong>Fecha del incidente:</strong> {new Date(seleccionada.fechaIncidente).toLocaleDateString()}</p>
                            <p><strong>Nombre:</strong> {seleccionada.nombre || 'Anonimo'}</p>
                            <p><strong>Apellido:</strong> {seleccionada.apellido || '---'}</p>
                            <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}><strong>Área:</strong> {seleccionada.area}</p>
                            <p><strong>Comentario:</strong> {seleccionada.comentario}</p>
                            <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}><strong>Descripción:</strong> {seleccionada.descripcion}</p>
                            <p><strong>¿Anónimo?:</strong> {seleccionada.anonimo ? 'Sí' : 'No'}</p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                              <strong>Firma:</strong>
                              {seleccionada.firma ? (
                                <button onClick={() => setMostrarFirma(true)} style={styles.buttonView}>Ver firma</button>
                              ) : '---'}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                              <strong>Evidencia:</strong>
                              {seleccionada.evidencia ? (
                                <button onClick={() => setMostrarImagen(true)} style={styles.buttonView}>Ver imagen</button>
                              ) : 'Sin evidencia'}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>

          {/* Modales */}
          {mostrarImagen && seleccionada?.evidencia && (
            <div style={styles.imageModal} onClick={() => setMostrarImagen(false)}>
              <img src={seleccionada.evidencia} alt="Evidencia" style={styles.modalImage} />
            </div>
          )}
          {mostrarFirma && seleccionada?.firma && (
            <div style={styles.signatureModal} onClick={() => setMostrarFirma(false)}>
              <img src={seleccionada.firma} alt="Firma" style={styles.modalImage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

const styles = {
  wrapper: {
  display: 'flex',
  minHeight: '100vh',
  width: '100vw',
  overflow: 'hidden',
  fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: '240px',
    backgroundColor: '#1e2a52',
    color: '#fff',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2 2 18px rgba(0, 0, 0, 1)',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '30px',
    textAlign: 'center',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  navItem: {
    padding: '12px 0',
    cursor: 'pointer',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    fontSize: '18px',
  },
  mainContent: {
  flexGrow: 1,
  backgroundColor: '#f0f2f5',
  overflow: 'auto',
  display: 'flex',
  justifyContent: 'center',
  padding: '20px',
  boxSizing: 'border-box',
  },
  contentBox: {
  width: '100%',
  maxWidth: '100%',
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 0 18px rgba(0,0,0,0.15)',
  padding: '30px',
  boxSizing: 'border-box',
  },
  heading: {
    fontSize: '26px',
    fontWeight: 'bold',
    marginBottom: '30px',
    textAlign: 'center',
    color: '#1e2a52',
  },
  filterSection: {
    marginBottom: '25px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '220px',
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    backgroundColor: '#f9f9f9',
    color: '#000',
    appearance: 'none',         // oculta estilo nativo (útil para personalizar)
    WebkitAppearance: 'none',   // Safari
    MozAppearance: 'none',      // Firefox
  },
  label: {
    marginBottom: '6px',
    fontWeight: 'bold',
    color: '#1e2a51',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
  },
  th: {
    backgroundColor: '#1e2a51',
    color: '#fff',
    padding: '14px',
    textAlign: 'left',
  },
  td: {
  padding: '12px',
  borderBottom: '1px solid #e0e0e0',
  color: '#000',
  },
  buttonView: {
    background: 'linear-gradient(to right, #1e2a51, #5c6bc0)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    float: 'right'
  },
  buttonClear: {
    backgroundColor: '#e53935',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  detailBox: {
    marginTop: '35px',
    padding: '25px',
    backgroundColor: '#f4f6f8',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    color: '#1e2a51',
  },
  detailTitle: {
    color: '#1e2a51',
    marginBottom: '15px',
  },
  noResults: {
    textAlign: 'center',
    padding: '25px',
    color: '#999',
  },
  imageModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    cursor: 'pointer'
  },
  signatureModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#ffffffa6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    cursor: 'pointer'
  },
  modalImage: {
    maxWidth: '90%',
    maxHeight: '90%',
    objectFit: 'contain'
  }
};
