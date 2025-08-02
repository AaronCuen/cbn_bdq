import React, { useState, useRef } from 'react';
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';
import './formQuejas.css';

const CLOUD_NAME = 'doptv8gka';
const UPLOAD_PRESET = 'ml_default';

const ComplaintForm = () => {
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

  const sigCanvas = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageData = new FormData();
    imageData.append('file', file);
    imageData.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        imageData
      );
      setFormData((prev) => ({ ...prev, evidencia: res.data.secure_url }));
      alert('Imagen subida correctamente');
    } catch (err) {
      console.error('Error subiendo imagen:', err);
      alert('Error al subir la imagen');
    }
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
      const dataURL = sigCanvas.current.getCanvas().toDataURL('image/png');
      const blob = dataURLToBlob(dataURL);

      const formDataSignature = new FormData();
      formDataSignature.append('file', blob);
      formDataSignature.append('upload_preset', UPLOAD_PRESET);

      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formDataSignature
      );

      const dataToSend = {
        ...formData,
        firma: uploadRes.data.secure_url,
      };

      await axios.post('http://vog40wk0ok8k0wc0oswss440.31.97.136.112.sslip.io/quejas', dataToSend);
      alert('Formulario enviado con éxito');
    } catch (err) {
      console.error('Error al enviar el formulario:', err);
      alert('Error al enviar el formulario');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">Buzón de Quejas</h2>

      <fieldset>
        <legend>¿Desea que sea anónima?</legend>
        <label>
          <input
            type="radio"
            name="anonimo"
            value="true"
            onChange={handleChange}
            checked={formData.anonimo === 'true'}
            required
          />
          Sí
        </label>
        <label>
          <input
            type="radio"
            name="anonimo"
            value="false"
            onChange={handleChange}
            checked={formData.anonimo === 'false'}
          />
          No
        </label>
      </fieldset>

      {formData.anonimo === 'false' && (
        <>
          <label>Nombre:
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </label>

          <label>Apellido:
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </label>
        </>
      )}

      <label>Fecha del incidente:
        <input
          type="date"
          name="fechaIncidente"
          value={formData.fechaIncidente}
          onChange={handleChange}
          required
        />
      </label>

      <fieldset>
        <legend>¿Qué desea comentar?</legend>
        {['Reclamo', 'Sugerencia', 'Felicitación', 'Queja'].map((tipo) => (
          <label key={tipo}>
            <input
              type="radio"
              name="comentario"
              value={tipo}
              onChange={handleChange}
              required
            />
            {tipo}
          </label>
        ))}
      </fieldset>

      <label>Área:
        <input
          type="text"
          name="area"
          value={formData.area}
          onChange={handleChange}
          required
        />
      </label>

      <label>Descripción:
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />
      </label>

      <label>Evidencia (imagen):
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {formData.evidencia && (
          <img src={formData.evidencia} alt="evidencia" className="preview-img" />
        )}
      </label>

      <label>Firma:</label>
      <SignatureCanvas
        penColor="black"
        canvasProps={{ maxwidth: 300, maxheight: 120, className: 'sigCanvas' }}
        ref={sigCanvas}
      />
      <button style={styles.formButton2} type="button" onClick={() => sigCanvas.current.clear()}>
        Borrar Firma
      </button>

      <button style={styles.formButton} type="submit">Enviar Queja</button>
    </form>
  );
};
export default ComplaintForm;

const styles = {
formButton: {
    padding: '12px',
    background: 'linear-gradient(to right, #1e2a51, #4347ee)',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    width: '100%',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '20px',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
  },
  formButton2: {
    padding: '12px',
    background: 'linear-gradient(to right, #1e2a51, #4347ee)',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    width: '50%',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '10px',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
  },
};
