import bcrypt from "bcrypt";

import Usuario from "../models/Usuario.js";
import { generarId, generarJWT } from "../helpers/generarId.js";
import { emailRegistro, emailOlvidePass, emailCodigoVerificacion } from '../helpers/email.js'


class Respuesta {
    status = '';
    msg = '';
    data = null;
}

// Función para registrar un nuevo usuario
const registrarUsuario = async (req, res, next) => {
    let respuesta = new Respuesta();

    try {
        const { pass, ...userData } = req.body;
        console.log(req.body);

        // Verificar si el email ya está registrado
        const existeUsuario = await Usuario.findOne({ email: userData.email });
        if (existeUsuario) {
            respuesta.status = 'error';
            respuesta.msg = 'El email ya está registrado';
            return res.status(400).json(respuesta);
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);

        // Crear el usuario
        const usuario = new Usuario({
            ...userData,
            pass: hashedPassword,
            token: generarId()
        });

        await usuario.save();

        const { email, name, token } = usuario;

        emailRegistro({ email, name, token });

        respuesta.status = 'success';
        respuesta.msg = 'Usuario registrado correctamente';
        respuesta.data = { id: usuario._id };
        res.status(201).json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al registrar el usuario';
        res.status(500).json(respuesta);
    }
};

// Confirmar cuenta de usuario por token
const confirmarUsuario = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const { token } = req.params;

        const usuario = await Usuario.findOne({ token });

        if (!usuario) {
            respuesta.status = 'error';
            respuesta.msg = 'Token inválido o usuario ya confirmado';
            return res.status(400).json(respuesta);
        }

        usuario.confirm = true;
        usuario.token = ""; // Limpia el token
        await usuario.save();

        respuesta.status = 'success';
        respuesta.msg = 'Cuenta confirmada correctamente';
        res.json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al confirmar la cuenta';
        res.status(500).json(respuesta);
    }
};


// Función para listar usuarios
const listarUsuarios = async (req, res, next) => {
    let respuesta = new Respuesta();

    try {
        const usuarios = await Usuario.find({}).select('-pass -token');
        respuesta.status = 'success';
        respuesta.msg = 'Usuarios listados correctamente';
        respuesta.data = usuarios;
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al listar usuarios';
        res.status(500).json(respuesta);
    }
};

// Función para obtener un usuario por ID
const obtenerUsuario = async (req, res, next) => {
    let respuesta = new Respuesta();

    try {
        const id = req.params.id;
        const usuario = await Usuario.findById(id).select('-pass -token');

        if (!usuario) {
            respuesta.status = 'error';
            respuesta.msg = 'Usuario no encontrado';
            return res.status(404).json(respuesta);
        }

        respuesta.status = 'success';
        respuesta.msg = 'Usuario encontrado';
        respuesta.data = usuario;
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al obtener el usuario';
        res.status(500).json(respuesta);
    }
};

// Función para editar un usuario
const editarUsuario = async (req, res, next) => {
    let respuesta = new Respuesta();

    try {
        const { id } = req.params;
        const { pass, ...userData } = req.body;

        const usuario = await Usuario.findById(id);
        if (!usuario) {
            respuesta.status = 'error';
            respuesta.msg = 'Usuario no encontrado';
            return res.status(404).json(respuesta);
        }

        // Si se está actualizando la contraseña, hashearla
        if (pass) {
            const salt = await bcrypt.genSalt(10);
            userData.pass = await bcrypt.hash(pass, salt);
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(id, userData, {
            new: true
        }).select('-pass -token');

        respuesta.status = 'success';
        respuesta.msg = 'Usuario actualizado correctamente';
        respuesta.data = usuarioActualizado;
        res.json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al actualizar el usuario';
        res.status(500).json(respuesta);
    }
};

// Función para eliminar un usuario
const eliminarUsuario = async (req, res, next) => {
    let respuesta = new Respuesta();

    try {
        const { id } = req.params;
        const usuario = await Usuario.findById(id);

        if (!usuario) {
            respuesta.status = 'error';
            respuesta.msg = 'Usuario no encontrado';
            return res.status(404).json(respuesta);
        }

        await Usuario.findByIdAndDelete(id);

        respuesta.status = 'success';
        respuesta.msg = 'Usuario eliminado correctamente';
        res.json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al eliminar el usuario';
        res.status(500).json(respuesta);
    }
};

// Función para login de usuario
const loginUsuario = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const { email, pass } = req.body;

        // Buscar usuario por email
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            respuesta.status = 'error';
            respuesta.msg = 'EL usuario no existe';
            return res.status(400).json(respuesta);
        }

        // Verificar contraseña
        const passwordCorrecto = await bcrypt.compare(pass, usuario.pass);
        if (!passwordCorrecto) {
            respuesta.status = 'error';
            respuesta.msg = 'Contraseña incorrecta';
            return res.status(400).json(respuesta);
        }

        if (usuario.confirm === false) {
            respuesta.status = 'error';
            respuesta.msg = 'La cuenta no ha sido confirmada';
            return res.status(400).json(respuesta);
        }

        // Generar JWT
        /**const token = generarJWT({ id: usuario._id, name: usuario.name });

        // Limpiar datos sensibles
        const usuarioRespuesta = usuario.toObject();
        delete usuarioRespuesta.pass;
        delete usuarioRespuesta.token;
        //delete usuarioRespuesta.role;
        delete usuarioRespuesta.confirm;

        // Configurar cookie
        res.cookie('_jwtn', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 2 //  días
        });

        // Responder con JSON
        //usuarioRespuesta.jwt = token;
        respuesta.status = 'success';
        respuesta.msg = 'Inicio de sesión exitoso';
        respuesta.data = usuarioRespuesta;
        res.json(respuesta);*/

        // Generar código de 6 dígitos
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Guardar OTP y expiración (5 minutos)
        usuario.otp = otp;
        usuario.otpExpires = Date.now() + 5 * 60 * 1000;
        await usuario.save();

        // Enviar el código por correo
        await emailCodigoVerificacion({
            email: usuario.email,
            name: usuario.name,
            otp: otp
        });

        // Enviar respuesta indicando que falta el 2FA
        respuesta.status = '2fa';
        respuesta.msg = 'Código enviado por correo';
        respuesta.data = { email: usuario.email };
        return res.json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al iniciar sesión';
        res.status(500).json(respuesta);
    }
};

const verificarCodigo = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const { email, codigo } = req.body;

        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            respuesta.status = 'error';
            respuesta.msg = 'Usuario no encontrado';
            return res.status(404).json(respuesta);
        }

        // Verificar código y expiración
        const expirado = !usuario.otpExpires || new Date(usuario.otpExpires) < new Date();
        const codigoValido = usuario.otp === codigo;

        if (!codigoValido || expirado) {
            respuesta.status = 'error';
            respuesta.msg = 'Código inválido o expirado';
            return res.status(401).json(respuesta);
        }

        // Limpiar OTP
        usuario.otp = null;
        usuario.otpExpires = null;
        await usuario.save();

        // Generar JWT
        const token = generarJWT({ id: usuario._id, name: usuario.name });

        // Limpiar datos sensibles
        const usuarioRespuesta = usuario.toObject();
        delete usuarioRespuesta.pass;
        delete usuarioRespuesta.token;
        //delete usuarioRespuesta.role;
        delete usuarioRespuesta.confirm;
        delete usuarioRespuesta.otp;
        delete usuarioRespuesta.otpExpires;

        res.cookie('_jwtn', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 2
        });

        respuesta.status = 'success';
        respuesta.msg = 'Autenticación completada';
        respuesta.data = usuarioRespuesta;
        res.json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al verificar el código';
        res.status(500).json(respuesta);
    }
};

const logoutUsuario = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        // Limpia la cookie del JWT
        res.clearCookie('_jwtn', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        respuesta.status = 'success';
        respuesta.msg = 'Sesión cerrada correctamente';
        res.json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al cerrar sesión';
        res.status(500).json(respuesta);
    }
};


const resetPasswordToken = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const { email } = req.body;

        // Validación básica de email
        if (!email || !email.includes('@')) {
            respuesta.status = 'error';
            respuesta.msg = 'Proporcione un email válido';
            return res.status(400).json(respuesta);
        }

        // Buscar usuario por email
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            respuesta.status = 'error';
            respuesta.msg = 'El email no está registrado';
            return res.status(404).json(respuesta);
        }

        // Generar token de recuperación
        usuario.token = generarId();
        await usuario.save();

        //Enviar email
        emailOlvidePass({
            email: usuario.email,
            name: usuario.name,
            token: usuario.token
        })


        respuesta.status = 'success';
        respuesta.msg = 'Se ha enviado un email con las instrucciones';
        res.json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Hubo un error al generar el token';
        res.status(500).json(respuesta);
    }
};

const comprobarResetToken = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const { token } = req.params;

        const usuario = await Usuario.findOne({ token });

        if (!usuario) {
            respuesta.status = 'error';
            respuesta.msg = 'Token inválido o expirado';
            respuesta.data = false;
            return res.status(404).json(respuesta);
        }

        respuesta.status = 'success';
        respuesta.msg = 'Token válido';
        respuesta.data = true;
        res.json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al validar el token';
        respuesta.data = false;
        res.status(500).json(respuesta);
    }
};

const nuevoPassword = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const { token } = req.params;
        const { pass, rpass } = req.body;

        // Validación manual
        if (!String(pass) || String(pass).length < 6) {
            respuesta.status = 'error';
            respuesta.msg = 'El password debe tener al menos 6 caracteres';
            return res.status(400).json(respuesta);
        }

        if (String(pass) !== String(rpass)) {
            respuesta.status = 'error';
            respuesta.msg = 'Los passwords no coinciden';
            return res.status(400).json(respuesta);
        }

        // Buscar usuario con el token
        const usuario = await Usuario.findOne({ token });

        if (!usuario) {
            respuesta.status = 'error';
            respuesta.msg = 'Token inválido';
            return res.status(404).json(respuesta);
        }

        // Hashear nueva contraseña
        const salt = await bcrypt.genSalt(10);
        usuario.pass = await bcrypt.hash(String(pass), salt);
        usuario.token = ""; // Limpia el token

        await usuario.save();

        respuesta.status = 'success';
        respuesta.msg = 'Password reestablecido correctamente';
        res.json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al reestablecer el password';
        res.status(500).json(respuesta);
    }
};


export {
    registrarUsuario,
    confirmarUsuario,
    listarUsuarios,
    obtenerUsuario,
    editarUsuario,
    eliminarUsuario,
    loginUsuario,
    verificarCodigo,
    logoutUsuario,
    resetPasswordToken,
    comprobarResetToken,
    nuevoPassword
};