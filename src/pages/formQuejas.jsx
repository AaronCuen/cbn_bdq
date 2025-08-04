import React, { useState, useRef } from 'react';
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';
import logo from '../assets/logo.jpg';


const CLOUD_NAME = 'doptv8gka';
const UPLOAD_PRESET = 'ml_default';

const styles = {
  pageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#1e2a52',
    padding: 20,
    boxSizing: 'border-box',
  },
  formContainer: {
    position: 'relative', // agregado para posicionar el logo
    maxWidth: 600,
    width: '100%',
    background: '#fff',
    borderRadius: 20,
    padding: 35,
    boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.3s ease',
  },
  logo: {
    position: 'absolute',
    top: 15,
    left: 15,
    width: 60,
    height: 'auto',
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 28,
    fontWeight: 700,
    color: '#1e2a51',
  },
  label: {
    display: 'block',
    marginBottom: 8,
    color: '#222',
    fontSize: 18,
    marginTop: 10,  // ← ESPACIO con su propio input
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: 14,
    border: '1px solid #ccc',
    borderRadius: 10,
    backgroundColor: '#f7f9fc',
    boxSizing: 'border-box',
    marginTop: 0,
    outline: 'none',
    transition: 'border 0.3s ease',
    boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
    color: '#000',
    appearance: 'none',         // oculta estilo nativo (útil para personalizar)
    WebkitAppearance: 'none',   // Safari
    MozAppearance: 'none',      // Firefox
  },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    fontSize: 14,
    border: '1px solid #ccc',
    borderRadius: 10,
    backgroundColor: '#f7f9fc',
    boxSizing: 'border-box',
    marginTop: 0,
    resize: 'vertical',
    minHeight: 100,
    outline: 'none',
    transition: 'border 0.3s ease',
    color: '#000',
  },
  fieldset: {
    border: 'none',
    backgroundColor: '#f2f4ff',
    padding: '15px 20px',
    borderRadius: 10,
    margin: '25px 0',
  },
  legend: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#1e2a51',
    marginBottom: 10,
  },
  radioLabel: {
    display: 'inline-block',
    marginRight: 20,
    fontWeight: 500,
    color: '#444',
    cursor: 'pointer',
  },
  radioInput: {
    marginRight: 8,
    transform: 'scale(1.2)',
    cursor: 'pointer',
    accentColor: '#1e2a51', // ← color del círculo
  },
  previewImg: {
    marginTop: 15,
    width: '100%',
    maxHeight: 250,
    objectFit: 'contain',
    borderRadius: 12,
    boxShadow: '0 0 12px rgba(0,0,0,0.15)',
  },
  sigCanvas: {
    width: '100%',
    height: 120,
    border: '2px dashed #ccc',
    borderRadius: 10,
    backgroundColor: '#fdfdfd',
    marginTop: 10,
  },
  formButton: {
    padding: '14px 20px',
    background: 'linear-gradient(135deg, #1e2a51, #4347ee)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    width: '100%',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 16,
    marginTop: 30,
    letterSpacing: 0.5,
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 20px rgba(67, 71, 238, 0.3)',
  },
  formButton2: {
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #1e2a51, #4347ee)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    width: '50%',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 16,
    marginTop: 20,
    letterSpacing: 0.3,
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 15px rgba(30, 42, 81, 0.4)',
  },
};

const ComplaintForm = () => {
  const fileInputRef = useRef(null);
  const sigCanvas = useRef(null);
  //const [focusedInput, setFocusedInput] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [formData, setFormData] = useState({
    fechaIncidente: '',
    nombre: '',
    apellido: '',
    comentario: '',
    area: '',
    descripcion: '',
    anonimo: 'false',
    evidencia: '',
  });

  // handleFocus = (name) => setFocusedInput(name);
  //const handleBlur = () => setFocusedInput(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageSelection = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, evidencia: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const dataURLToBlob = (dataURL) => {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let evidenciaURL = '';
      if (selectedImageFile) {
        const imageData = new FormData();
        imageData.append('file', selectedImageFile);
        imageData.append('upload_preset', UPLOAD_PRESET);
        const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, imageData);
        evidenciaURL = res.data.secure_url;
      }

      const dataURL = sigCanvas.current.getCanvas().toDataURL('image/png');
      const blob = dataURLToBlob(dataURL);
      const formDataSignature = new FormData();
      formDataSignature.append('file', blob);
      formDataSignature.append('upload_preset', UPLOAD_PRESET);
      const uploadRes = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formDataSignature);

      const dataToSend = {
        ...formData,
        evidencia: evidenciaURL,
        firma: uploadRes.data.secure_url,
      };

      if (formData.anonimo === 'true') {
        delete dataToSend.nombre;
        delete dataToSend.apellido;
      }

      await axios.post('http://vog40wk0ok8k0wc0oswss440.31.97.136.112.sslip.io/quejas', dataToSend);
      alert('Formulario enviado con éxito');

      setFormData({
        fechaIncidente: '',
        nombre: '',
        apellido: '',
        comentario: '',
        area: '',
        descripcion: '',
        anonimo: 'false',
        evidencia: '',
      });
      setSelectedImageFile(null);
      sigCanvas.current.clear();
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Error al enviar el formulario:', err);
      alert('Error al enviar el formulario');
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <form onSubmit={handleSubmit} style={styles.formContainer}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <h2 style={styles.formTitle}>Buzón de Quejas</h2>

        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>¿Desea que sea anónima?</legend>
          <label style={styles.radioLabel}>
            <input type="radio" name="anonimo" value="true" checked={formData.anonimo === 'true'} onChange={handleChange} style={styles.radioInput} />
            Sí
          </label>
          <label style={styles.radioLabel}>
            <input type="radio" name="anonimo" value="false" checked={formData.anonimo === 'false'} onChange={handleChange} style={styles.radioInput} />
            No
          </label>
        </fieldset>

        {formData.anonimo === 'false' && (
          <>
            <label style={styles.label}>Nombre:</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} style={styles.input} />

            <label style={styles.label}>Apellido:</label>
            <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} style={styles.input} />
          </>
        )}

        <label style={styles.label}>Fecha del incidente:</label>
        <input type="date" name="fechaIncidente" value={formData.fechaIncidente} onChange={handleChange} style={styles.input} />

        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>¿Qué desea comentar?</legend>
          {['Reclamo', 'Sugerencia', 'Felicitación', 'Queja'].map((tipo) => (
            <label key={tipo} style={styles.radioLabel}>
              <input type="radio" name="comentario" value={tipo} checked={formData.comentario === tipo} onChange={handleChange} style={styles.radioInput} />
              {tipo}
            </label>
          ))}
        </fieldset>

        <label style={styles.label}>Área:</label>
        <input type="text" name="area" value={formData.area} onChange={handleChange} style={styles.input} />

        <label style={styles.label}>Descripción:</label>
        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} style={styles.textarea} />

        <label style={styles.label}>Evidencia (imagen):</label>
        <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageSelection} style={{ marginBottom: 10 }} />
        {selectedImageFile && <img src={formData.evidencia} alt="Evidencia" style={styles.previewImg} />}

        <label style={styles.label}>Firma:</label>
        <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ style: styles.sigCanvas }} />
        <button type="button" onClick={() => sigCanvas.current.clear()} style={styles.formButton2}>Borrar firma</button>

        <button type="submit" style={styles.formButton}>Enviar</button>
      </form>
    </div>
  );
};

export default ComplaintForm;
