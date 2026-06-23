const express = require('express');
const router = express.Router();

const Usuario = require('../models/Usuario');
const Partido = require('../models/Partido');
const Apuesta = require('../models/Apuesta');
const Resultado = require('../models/Resultado');

// --- USUARIOS ---
router.get('/usuarios', async (req, res) => {
  try { res.json(await Usuario.find()); } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/usuarios', async (req, res) => {
  try {
    const nuevoUsuario = new Usuario({ nombre: req.body.nombre });
    res.status(201).json(await nuevoUsuario.save());
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// --- PARTIDOS ---
router.get('/partidos', async (req, res) => {
  try { res.json(await Partido.find()); } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/partidos', async (req, res) => {
  try {
    const nuevoPartido = new Partido(req.body);
    res.status(201).json(await nuevoPartido.save());
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// --- APUESTAS ---
router.get('/apuestas', async (req, res) => {
  try { res.json(await Apuesta.find()); } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/apuestas', async (req, res) => {
  const { usuarioId, partidoId, golesLocal, golesVisitante } = req.body;
  try {
    // Si ya existe la apuesta la actualiza, si no, la crea (Upsert)
    const apuesta = await Apuesta.findOneAndUpdate(
      { usuarioId, partidoId },
      { golesLocal: Number(golesLocal), golesVisitante: Number(golesVisitante) },
      { new: true, upsert: true }
    );
    res.json(apuesta);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// --- RESULTADOS ---
router.get('/resultados', async (req, res) => {
  try { res.json(await Resultado.find()); } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/resultados', async (req, res) => {
  const { partidoId, golesLocal, golesVisitante } = req.body;
  try {
    const resultado = await Resultado.findOneAndUpdate(
      { partidoId },
      { golesLocal: Number(golesLocal), golesVisitante: Number(golesVisitante) },
      { new: true, upsert: true }
    );
    res.json(resultado);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;