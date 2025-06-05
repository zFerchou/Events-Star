// routes/cityRoutes.js
import express from "express";
import {
  crearCiudad,
  listarCiudades,
  obtenerCiudad,
  actualizarCiudad,
  eliminarCiudad
} from "../controllers/cityController.js";

const router = express.Router();

// http://localhost:4222/cities
router.get("/", listarCiudades);
router.get("/:id", obtenerCiudad);
router.post("/", crearCiudad);
router.put("/:id", actualizarCiudad);
router.delete("/:id", eliminarCiudad);

export default router;
