import React, { useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo.jpg';
import { useNavigate } from 'react-router-dom';

function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleForm = async () => {
    navigate('/formulario')
  };
  

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Por favor, llena todos los campos');
      return;
    }

    try {
      const res = await axios.post('http://vog40wk0ok8k0wc0oswss440.31.97.136.112.sslip.io/login', {
        email,
        password,
      });

      if (res.data.success) {
      
        localStorage.setItem('token', 'logueado');

        alert('Bienvenido ' + res.data.admin.nombre);
        navigate('/home');
      } else {
        alert(res.data.message || 'Correo o contraseña incorrectos');
      }
    } catch (error) {
      console.error(error);
      alert('Error al conectar con el servidor');
    }
  };


  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.left}>
          <img src={logo} alt="Logo" style={styles.logo} />
          <h3 style={styles.heading}>Bienvenido, Por favor inicie sesión en su cuenta.</h3>
          <input
            style={styles.input}
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button style={styles.loginButton} onClick={handleLogin}>
            INICIAR
          </button>
        </div>

        <div style={styles.right}>
          <h2 style={styles.rightTitle}>BUZON CBN.</h2>
          <p style={styles.rightText}>
            Ponemos a su disposición este documento, que deberá rellenar en caso de querer compartir una queja, sugerencia o felicitación.
          </p>
          <button style={styles.formButton} onClick={handleForm}>Llenar formulario</button>
        </div>
      </div>
    </div>
  );
}

export default LoginAdmin;

const styles = {
  wrapper: {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('/fondo.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    display: 'flex',
    width: '900px',
    height: '500px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
    backgroundColor: '#fff',
  },
  left: {
    width: '50%',
    backgroundColor: '#fff',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    width: '50%',
    background: 'linear-gradient(to bottom right, #1e2a51, #5e5eff)',
    color: '#fff',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  logo: {
    width: '100px',
    marginBottom: '20px',
  },
  heading: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  input: {
    padding: '10px',
    marginBottom: '15px',
    border: 'none',
    borderBottom: '1px solid #ccc',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
    backgroundColor: 'transparent',
    color: 'black'
  },
  loginButton: {
    padding: '12px',
    background: 'linear-gradient(to right, #1e2a51, #4347ee)',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    width: '100%',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '10px',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
  },
  rightTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  rightText: {
    fontSize: '14px',
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  formButton: {
    padding: '10px 20px',
    backgroundColor: '#52d869',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    width: 'fit-content',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};
