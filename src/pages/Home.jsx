import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div style={styles.container}>
      <div style={styles.logoutContainer}>
        <button style={styles.logoutButton} onClick={handleLogout}>Cerrar sesión</button>
      </div>

      <div style={styles.contentBox}>
        <h2 style={styles.heading}>Panel de Administrador - Quejas</h2>

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
              <th style={styles.th}>Apellido</th>
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
                    <td style={styles.td}>{q.apellido || 'anonimo'}</td>
                    <td style={styles.td}>{q.comentario}</td>
                    <td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{q.area}</td>
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
  );
};


export default Home;

  const styles = {

    logoutContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '10px 20px'
    },
    logoutButton: {
      backgroundColor: '#c62828',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '8px 14px',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },

    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif',
      color: '#263238',
      maxWidth:'100%',
    },
    contentBox: {
      width: '90%',
      maxWidth: '1000px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 0 18px rgba(0,0,0,0.15)',
      padding: '30px',
    },
    heading: {
      fontSize: '26px',
      fontWeight: 'bold',
      marginBottom: '30px',
      textAlign: 'center',
      color: '#1a237e',
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
    },
    label: {
      marginBottom: '6px',
      fontWeight: 'bold',
      color: '#1a237e',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#fff',
    },
    th: {
      backgroundColor: '#1a237e',
      color: '#fff',
      padding: '14px',
      textAlign: 'left',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #e0e0e0',
    },
    buttonView: {
      background: 'linear-gradient(to right, #1a237e, #5c6bc0)',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '8px 14px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      float: 'right' //
    },  

    detailBox: {
      marginTop: '35px',
      padding: '25px',
      backgroundColor: '#f4f6f8',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      color: '#263238',
    },
    detailTitle: {
      color: '#1a237e',
      marginBottom: '15px',
    },
    closeButton: {
      marginTop: '20px',
      backgroundColor: '#4caf50',
      color: '#fff',
      border: 'none',
      padding: '10px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
    },
    noResults: {
      textAlign: 'center',
      padding: '25px',
      color: '#999',
    },
  // ...otros estilos que ya tienes
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
    zIndex: 1000, // <-- Asegúrate que esté por encima de todo
    cursor: 'pointer'
  },
  signatureModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000, // <-- Asegúrate que esté por encima de todo
    cursor: 'pointer'
  },
  modalImage: {
    maxWidth: '90%',
    maxHeight: '90%',
    objectFit: 'contain'
  }


  };
