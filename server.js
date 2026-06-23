const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Conectar BD (Mongoose maneja internamente el pool de conexiones en Serverless)
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', require('./routes/api'));

// Ruta de prueba opcional para verificar el estado de la API
app.get('/', (req, res) => {
  res.json({ status: "API de Polla Futbolera funcionando correctamente" });
});

// ESCUCHAR SOLO EN LOCAL
// Vercel no usa app.listen, por lo que solo lo ejecutamos si no estamos en su entorno
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Servidor local corriendo en http://localhost:${PORT}`));
}

// CRUCIAL PARA VERCEL: Exportar el módulo de la app
module.exports = app;