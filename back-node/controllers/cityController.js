// controllers/cityController.js
import City from "../models/City.js";

class Respuesta {
  status = "";
  msg = "";
  data = null;
}

// Crear ciudad
const crearCiudad = async (req, res) => {
  const respuesta = new Respuesta();

  try {
    const city = new City(req.body);
    await city.save();

    respuesta.status = "success";
    respuesta.msg = "Ciudad creada correctamente";
    respuesta.data = city;
    res.status(201).json(respuesta);
  } catch (error) {
    console.log(error);
    respuesta.status = "error";
    respuesta.msg = "Error al crear ciudad";
    res.status(400).json(respuesta);
  }
};

// Obtener todas las ciudades
const listarCiudades = async (req, res) => {
  const respuesta = new Respuesta();

  try {
    const ciudades = await City.find();
    respuesta.status = "success";
    respuesta.msg = "Ciudades obtenidas correctamente";
    respuesta.data = ciudades;
    res.json(respuesta);
  } catch (error) {
    console.log(error);
    respuesta.status = "error";
    respuesta.msg = "Error al obtener ciudades";
    res.status(500).json(respuesta);
  }
};

// Obtener ciudad por ID
const obtenerCiudad = async (req, res) => {
  const respuesta = new Respuesta();

  try {
    const ciudad = await City.findById(req.params.id);
    if (!ciudad) {
      respuesta.status = "error";
      respuesta.msg = "Ciudad no encontrada";
      return res.status(404).json(respuesta);
    }

    respuesta.status = "success";
    respuesta.msg = "Ciudad encontrada";
    respuesta.data = ciudad;
    res.json(respuesta);
  } catch (error) {
    console.log(error);
    respuesta.status = "error";
    respuesta.msg = "Error al obtener ciudad";
    res.status(500).json(respuesta);
  }
};

// Actualizar ciudad
const actualizarCiudad = async (req, res) => {
  const respuesta = new Respuesta();

  try {
    const ciudad = await City.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!ciudad) {
      respuesta.status = "error";
      respuesta.msg = "Ciudad no encontrada";
      return res.status(404).json(respuesta);
    }

    respuesta.status = "success";
    respuesta.msg = "Ciudad actualizada correctamente";
    respuesta.data = ciudad;
    res.json(respuesta);
  } catch (error) {
    console.log(error);
    respuesta.status = "error";
    respuesta.msg = "Error al actualizar ciudad";
    res.status(400).json(respuesta);
  }
};

// Eliminar ciudad
const eliminarCiudad = async (req, res) => {
  const respuesta = new Respuesta();

  try {
    const ciudad = await City.findByIdAndDelete(req.params.id);

    if (!ciudad) {
      respuesta.status = "error";
      respuesta.msg = "Ciudad no encontrada";
      return res.status(404).json(respuesta);
    }

    respuesta.status = "success";
    respuesta.msg = "Ciudad eliminada correctamente";
    respuesta.data = ciudad;
    res.json(respuesta);
  } catch (error) {
    console.log(error);
    respuesta.status = "error";
    respuesta.msg = "Error al eliminar ciudad";
    res.status(500).json(respuesta);
  }
};

export {
  crearCiudad,
  listarCiudades,
  obtenerCiudad,
  actualizarCiudad,
  eliminarCiudad,
};
