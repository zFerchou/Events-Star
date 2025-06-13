import express from "express";
import {
    crearEvento,
    listarEventos,
    obtenerEvento,
    editarEvento,
    eliminarEvento,
    agregarParticipante,
    anularReserva
} from "../controllers/eventtController.js";
import guardia from '../middleware/guardiaRuta.js'; 
import checkRole from "../middleware/checkRole.js";
import upload from "../middleware/procesarImage.js";

const router = express.Router();

// URL: http://localhost:4222/events

router.post('/', guardia, checkRole('4DMlN'), upload.single('image'), crearEvento);
router.get('/', listarEventos);
router.get('/:id', obtenerEvento);
router.put('/:id', guardia ,editarEvento);
router.delete('/:id', eliminarEvento);

// Añadir participante al evento
router.post('/:idEvento/participantes', agregarParticipante);

// Anular reservación de un evento
router.delete('/:idEvento/participantes', anularReserva);

export default router;
