const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Si ya existe una conexión activa, no creamos otra
    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Conectado Exitosamente...");
  } catch (error) {
    console.error("Error crítico de conexión a MongoDB:", error.message);
    // En Serverless no usamos process.exit(1) porque tumbaría el contenedor de Vercel por completo
  }
};

module.exports = connectDB;