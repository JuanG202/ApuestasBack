const express = require('express');
const router = express.Router();

// IMPORTACIONES CORREGIDAS EN SINGULAR (Coincidiendo con tus archivos de VS Code)
const Usuario = require('../models/Usuario');
const Partido = require('../models/Partido');
const Apuesta = require('../models/Apuesta');
const Resultado = require('../models/Resultado');

// ==========================================
// RUTAS DE USUARIOS
// ==========================================
router.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios.map(u => ({ id: u._id, nombre: u.nombre })));
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

router.post('/usuarios', async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });

    const nuevoUsuario = new Usuario({ nombre });
    await nuevoUsuario.save();
    res.json({ id: nuevoUsuario._id, nombre: nuevoUsuario.nombre });
  } catch (error) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

// ==========================================
// RUTAS DE PARTIDOS
// ==========================================
router.get('/partidos', async (req, res) => {
  try {
    const partidos = await Partido.find();
    res.json(partidos.map(p => ({ id: p._id, local: p.local, visitante: p.visitante, fecha: p.fecha })));
  } catch (error) {
    res.status(500).json({ error: "Error al obtener partidos" });
  }
});

router.post('/partidos', async (req, res) => {
  try {
    const { local, visitante, fecha } = req.body;
    if (!local || !visitante || !fecha) {
      return res.status(400).json({ error: "Faltan campos obligatorios en el partido" });
    }

    const nuevoPartido = new Partido({ local, visitante, fecha });
    await nuevoPartido.save();
    res.json({ id: nuevoPartido._id, local: nuevoPartido.local, visitante: nuevoPartido.visitante, fecha: nuevoPartido.fecha });
  } catch (error) {
    res.status(500).json({ error: "Error al crear partido" });
  }
});

// ==========================================
// RUTAS DE APUESTAS (PERMITE MÚLTIPLES APUESTAS POR PARTIDO)
// ==========================================
router.get('/apuestas', async (req, res) => {
  try {
    const apuestas = await Apuesta.find();
    res.json(apuestas.map(a => ({
      id: a._id, // Agregamos el ID único de la apuesta por si lo necesitas en el frontend
      usuarioId: a.usuarioId,
      partidoId: a.partidoId,
      golesLocal: a.golesLocal,
      golesVisitante: a.golesVisitante
    })));
  } catch (error) {
    res.status(500).json({ error: "Error al obtener apuestas" });
  }
});

router.post('/apuestas', async (req, res) => {
  try {
    const { usuarioId, partidoId, golesLocal, golesVisitante } = req.body;
    
    if (!usuarioId || !partidoId || golesLocal === undefined || golesVisitante === undefined) {
      return res.status(400).json({ error: "Datos incompletos para registrar la apuesta" });
    }

    // CAMBIO CLAVE: Usamos 'new Apuesta' y '.save()' para que CADA VEZ que le des click 
    // a guardar, cree una apuesta nueva en la base de datos, permitiendo duplicar el partido.
    const nuevaApuesta = new Apuesta({
      usuarioId,
      partidoId,
      golesLocal: Number(golesLocal),
      golesVisitante: Number(golesVisitante)
    });

    const apuestaGuardada = await nuevaApuesta.save();

    res.json({
      mensaje: "Apuesta registrada con éxito",
      id: apuestaGuardada._id,
      usuarioId: apuestaGuardada.usuarioId,
      partidoId: apuestaGuardada.partidoId,
      golesLocal: apuestaGuardada.golesLocal,
      golesVisitante: apuestaGuardada.golesVisitante
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno al guardar la apuesta" });
  }
});

// ==========================================
// RUTAS DE RESULTADOS OFICIALES (UPSERT)
// ==========================================
router.get('/resultados', async (req, res) => {
  try {
    const resultados = await Resultado.find();
    res.json(resultados.map(r => ({
      partidoId: r.partidoId,
      golesLocal: r.golesLocal,
      golesVisitante: r.golesVisitante
    })));
  } catch (error) {
    res.status(500).json({ error: "Error al obtener resultados" });
  }
});

router.post('/resultados', async (req, res) => {
  try {
    const { partidoId, golesLocal, golesVisitante } = req.body;
    if (!partidoId || golesLocal === undefined || golesVisitante === undefined) {
      return res.status(400).json({ error: "Datos de resultado oficial incompletos" });
    }

    const resultadoGuardado = await Resultado.findOneAndUpdate(
      { partidoId },
      { golesLocal: Number(golesLocal), golesVisitante: Number(golesVisitante) },
      { new: true, upsert: true }
    );

    res.json({
      partidoId: resultadoGuardado.partidoId,
      golesLocal: resultadoGuardado.golesLocal,
      golesVisitante: resultadoGuardado.golesVisitante
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno al guardar el resultado oficial" });
  }
});

module.exports = router;