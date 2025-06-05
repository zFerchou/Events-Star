import Eventt from "../models/Eventt.js";
import Usuario from "../models/Usuario.js";

class Respuesta {
    status = '';
    msg = '';
    data = null;
}

// Crear evento
const crearEvento = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const { date } = req.body;

        // Validar fecha
        const fechaEvento = new Date(date);
        if (isNaN(fechaEvento.getTime()) || fechaEvento <= new Date()) {
            respuesta.status = 'error';
            respuesta.msg = 'La fecha del evento debe estar en el futuro.';
            return res.status(400).json(respuesta);
        }

        const nombreEvento = req.body.eventName?.trim().toLowerCase();
        const eventoExistente = await Eventt.findOne({
            eventName: { $regex: new RegExp(`^${nombreEvento}$`, 'i') }
        });

        if (eventoExistente) {
            respuesta.status = 'error';
            respuesta.msg = 'Ya existe un evento con ese nombre.';
            return res.status(400).json(respuesta);
        }

        const nuevoEvento = new Eventt({
            ...req.body,
            createdBy: req.usuario._id,
            image: req.file ? req.file.filename : null  // <-- acá guardas el nombre del archivo
        });

        await nuevoEvento.save();

        respuesta.status = 'success';
        respuesta.msg = 'Evento creado correctamente';
        respuesta.data = nuevoEvento;
        res.status(201).json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al crear el evento';
        res.status(400).json(respuesta);
    }
};


// Obtener todos los eventos
const listarEventos = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const eventos = await Eventt.find()
            .populate('city')
            .populate('areaInteres')
            .populate('participants', '-pass -token');

        respuesta.status = 'success';
        respuesta.msg = 'Eventos listados correctamente';
        respuesta.data = eventos;
        res.json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al listar eventos';
        res.status(500).json(respuesta);
    }
};

// Obtener un evento por ID
const obtenerEvento = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const { id } = req.params;
        const evento = await Eventt.findById(id)
            .populate('city')
            .populate('areaInteres')
            .populate('participants', '-pass -token');

        if (!evento) {
            respuesta.status = 'error';
            respuesta.msg = 'Evento no encontrado';
            return res.status(404).json(respuesta);
        }

        respuesta.status = 'success';
        respuesta.msg = 'Evento encontrado';
        respuesta.data = evento;
        res.json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al obtener el evento';
        res.status(500).json(respuesta);
    }
};

// Actualizar un evento
const editarEvento = async (req, res) => {
    let respuesta = new Respuesta();
    console.log(req.usuario);
    try {
        const { id } = req.params;
        const nuevosDatos = req.body;

        const evento = await Eventt.findById(id);

        if (!evento) {
            respuesta.status = 'error';
            respuesta.msg = 'Evento no encontrado';
            return res.status(404).json(respuesta);
        }

        if(evento.createdBy.toString() !== req.usuario._id.toString()){
            respuesta.status = 'error';
            respuesta.msg = 'No puedes modificar eventos de otro usuario';
            return res.status(403).json(respuesta);
        }

        // Validación 1: maxCapacity no menor que los participantes actuales
        if (nuevosDatos.maxCapacity !== undefined && nuevosDatos.maxCapacity < evento.participants.length) {
            respuesta.status = 'error';
            respuesta.msg = `No puedes reducir la capacidad a menos de ${evento.participants.length} participantes existentes.`;
            return res.status(400).json(respuesta);
        }

        // Validación 2: la fecha nueva no puede estar en el pasado
        if (nuevosDatos.date) {
            const nuevaFecha = new Date(nuevosDatos.date);
            if (isNaN(nuevaFecha.getTime()) || nuevaFecha <= new Date()) {
                respuesta.status = 'error';
                respuesta.msg = 'La fecha del evento debe estar en el futuro.';
                return res.status(400).json(respuesta);
            }
        }

        // Actualización parcial
        Object.assign(evento, nuevosDatos);
        await evento.save();

        respuesta.status = 'success';
        respuesta.msg = 'Evento actualizado correctamente';
        respuesta.data = evento;
        res.json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al actualizar el evento';
        res.status(500).json(respuesta);
    }
};



// Eliminar evento
const eliminarEvento = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const { id } = req.params;
        const evento = await Eventt.findByIdAndDelete(id);

        if (!evento) {
            respuesta.status = 'error';
            respuesta.msg = 'Evento no encontrado';
            return res.status(404).json(respuesta);
        }

        respuesta.status = 'success';
        respuesta.msg = 'Evento eliminado correctamente';
        res.json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al eliminar el evento';
        res.status(500).json(respuesta);
    }
};

// Añadir participante a un evento
const agregarParticipante = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const { idEvento } = req.params;
        const { idUsuario } = req.body;

        const evento = await Eventt.findById(idEvento);

        if (!evento) {
            respuesta.status = 'error';
            respuesta.msg = 'Evento no encontrado';
            return res.status(404).json(respuesta);
        }

        const usuario = await Usuario.findById(idUsuario);
        if (!usuario) {
            respuesta.status = 'error';
            respuesta.msg = 'Usuario no encontrado';
            return res.status(404).json(respuesta);
        }

        if (evento.participants.includes(idUsuario)) {
            respuesta.status = 'error';
            respuesta.msg = 'El usuario ya está registrado en el evento';
            return res.status(400).json(respuesta);
        }

        if (evento.participants.length >= evento.maxCapacity) {
            respuesta.status = 'error';
            respuesta.msg = 'El evento ya alcanzó su capacidad máxima';
            return res.status(400).json(respuesta);
        }

        evento.participants.push(idUsuario);
        await evento.save();

        respuesta.status = 'success';
        respuesta.msg = 'Participante añadido correctamente';
        respuesta.data = evento;
        res.json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al añadir participante';
        res.status(500).json(respuesta);
    }
};

export {
    crearEvento,
    listarEventos,
    obtenerEvento,
    editarEvento,
    eliminarEvento,
    agregarParticipante
};
