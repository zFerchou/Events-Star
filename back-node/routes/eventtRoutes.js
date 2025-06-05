import express from "express";
import {
    crearEvento,
    listarEventos,
    obtenerEvento,
    editarEvento,
    eliminarEvento,
    agregarParticipante
} from "../controllers/eventtController.js";
import guardia from '../middleware/guardiaRuta.js'; 
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

// Base: http://localhost:PUERTO/api/eventos

router.post('/', guardia, checkRole('4DMlN'), crearEvento);
router.get('/', listarEventos);
router.get('/:id', obtenerEvento);
router.put('/:id', guardia ,editarEvento);
router.delete('/:id', eliminarEvento);

// Añadir participante al evento
router.post('/:idEvento/participantes', agregarParticipante);

export default router;
