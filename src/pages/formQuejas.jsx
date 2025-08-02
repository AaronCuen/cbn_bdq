import React, { useState, useRef } from 'react';
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';
import './formQuejas.css';

const CLOUD_NAME = 'doptv8gka';
const UPLOAD_PRESET = 'ml_default';

const ComplaintForm = () => {
  const fileInputRef = useRef(null);
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

  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const sigCanvas = useRef(null);

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

    // Mostrar vista previa (opcional)
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

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          imageData
        );

        evidenciaURL = res.data.secure_url;
      }

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

      if (fileInputRef.current) {
        fileInputRef.current.value = ''; 
      }

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
        <input type="file" accept="image/*" onChange={handleImageSelection} ref={fileInputRef}/>
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
