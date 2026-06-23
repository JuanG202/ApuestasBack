const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Conectar a MongoDB
connectDB();

// Configuración robusta de CORS (Ya maneja los Preflights/OPTIONS automáticamente)
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 
}));

// ❌ AQUÍ BORRAMOS LA LÍNEA: app.options('*', cors()); <-- ESTA ERA LA QUE REVENTABA EL SERVIDOR

// Middleware para procesar JSON
app.use(express.json());

// Enrutador de la API
app.use('/api', require('./routes/api'));

// Ruta base de control de estado
app.get('/', (req, res) => {
  res.json({ status: "API de Polla Futbolera corriendo sin problemas." });
});

// Levantar servidor tradicional solo si estamos en desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Servidor local corriendo en http://localhost:${PORT}`));
}

module.exports = app;