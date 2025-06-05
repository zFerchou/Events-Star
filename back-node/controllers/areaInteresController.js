// controllers/areaInteresController.js
import AreaInteres from "../models/AreaInteres.js";

class Respuesta {
  status = "";
  msg = "";
  data = null;
}

// Crear área de interés
const crearArea = async (req, res) => {
  const respuesta = new Respuesta();

  try {
    const area = new AreaInteres(req.body);
    await area.save();

    respuesta.status = "success";
    respuesta.msg = "Área de interés creada correctamente";
    respuesta.data = area;
    res.status(201).json(respuesta);
  } catch (error) {
    console.log(error);
    respuesta.status = "error";
    respuesta.msg = "Error al crear área de interés";
    res.status(400).json(respuesta);
  }
};

// Listar áreas
const listarAreas = async (req, res) => {
  const respuesta = new Respuesta();

  try {
    const areas = await AreaInteres.find();
    respuesta.status = "success";
    respuesta.msg = "Áreas listadas correctamente";
    respuesta.data = areas;
    res.json(respuesta);
  } catch (error) {
    console.log(error);
    respuesta.status = "error";
    respuesta.msg = "Error al obtener las áreas";
    res.status(500).json(respuesta);
  }
};

// Obtener área por ID
const obtenerArea = async (req, res) => {
  const respuesta = new Respuesta();

  try {
    const area = await AreaInteres.findById(req.params.id);
    if (!area) {
      respuesta.status = "error";
      respuesta.msg = "Área no encontrada";
      return res.status(404).json(respuesta);
    }

    respuesta.status = "success";
    respuesta.msg = "Área encontrada";
    respuesta.data = area;
    res.json(respuesta);
  } catch (error) {
    console.log(error);
    respuesta.status = "error";
    respuesta.msg = "Error al buscar el área";
    res.status(500).json(respuesta);
  }
};

// Actualizar área
const actualizarArea = async (req, res) => {
  const respuesta = new Respuesta();

  try {
    const area = await AreaInteres.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!area) {
      respuesta.status = "error";
      respuesta.msg = "Área no encontrada";
      return res.status(404).json(respuesta);
    }

    respuesta.status = "success";
    respuesta.msg = "Área actualizada correctamente";
    respuesta.data = area;
    res.json(respuesta);
  } catch (error) {
    console.log(error);
    respuesta.status = "error";
    respuesta.msg = "Error al actualizar el área";
    res.status(400).json(respuesta);
  }
};

// Eliminar área
const eliminarArea = async (req, res) => {
  const respuesta = new Respuesta();

  try {
    const area = await AreaInteres.findByIdAndDelete(req.params.id);

    if (!area) {
      respuesta.status = "error";
      respuesta.msg = "Área no encontrada";
      return res.status(404).json(respuesta);
    }

    respuesta.status = "success";
    respuesta.msg = "Área eliminada correctamente";
    respuesta.data = area;
    res.json(respuesta);
  } catch (error) {
    console.log(error);
    respuesta.status = "error";
    respuesta.msg = "Error al eliminar el área";
    res.status(500).json(respuesta);
  }
};

export {
  crearArea,
  listarAreas,
  obtenerArea,
  actualizarArea,
  eliminarArea,
};
