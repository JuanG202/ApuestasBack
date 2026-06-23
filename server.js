const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Conectar a MongoDB
connectDB();

// Configuración robusta de CORS para producción en Vercel
app.use(cors({
  origin: '*', // Permite solicitudes desde cualquier origen (incluyendo tu frontend apuestas-two.vercel.app)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // Fuerza respuesta exitosa a peticiones preflight del navegador
}));

// Interceptor global para peticiones de tipo OPTIONS (Preflight)
app.options('*', cors());

// Middleware para procesar JSON en el cuerpo de las peticiones
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