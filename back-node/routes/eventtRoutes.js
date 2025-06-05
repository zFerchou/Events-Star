import express from "express";
import {
    crearEvento,
    listarEventos,
    obtenerEvento,
    editarEvento,
    eliminarEvento,
    agregarParticipante
} from "../controllers/eventtController.js";

const router = express.Router();

// Base: http://localhost:PUERTO/api/eventos

router.post('/', crearEvento);
router.get('/', listarEventos);
router.get('/:id', obtenerEvento);
router.put('/:id', editarEvento);
router.delete('/:id', eliminarEvento);

// Añadir participante al evento
router.post('/:idEvento/participantes', agregarParticipante);

export default router;
