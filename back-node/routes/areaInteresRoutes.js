// routes/areaInteresRoutes.js
import express from "express";
import {
  crearArea,
  listarAreas,
  obtenerArea,
  actualizarArea,
  eliminarArea,
} from "../controllers/areaInteresController.js";

const router = express.Router();

// http://localhost:4222/areas
router.get("/", listarAreas);
router.get("/:id", obtenerArea);
router.post("/", crearArea);
router.put("/:id", actualizarArea);
router.delete("/:id", eliminarArea);

export default router;
