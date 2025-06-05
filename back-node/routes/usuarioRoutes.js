// routes/usuarioRoutes.js
import express from "express";

import { 
    registrarUsuario,
    confirmarUsuario,
    listarUsuarios,
    obtenerUsuario,
    editarUsuario,
    eliminarUsuario,
    loginUsuario,
    resetPasswordToken,
    comprobarResetToken,
    nuevoPassword
} from "../controllers/usuarioController.js";

const router = express.Router();

// http://localhost:4222/users

// Registrar un nuevo usuario
router.post('/registro', registrarUsuario);

//Confirmacion de la cuenta
router.get('/confirmar/:token', confirmarUsuario);

// Login de usuario
router.post('/login', loginUsuario);

// Listar todos los usuarios
router.get('/', listarUsuarios);

// Obtener un usuario por ID
router.get('/:id', obtenerUsuario);

// Editar un usuario por ID
router.put('/:id', editarUsuario);

// Eliminar un usuario por ID
router.delete('/:id', eliminarUsuario);

// Solicitar token para recuperación de contraseña
router.post('/olvide-password', resetPasswordToken);

// Validar token para restablecimiento de contraseña
router.get('/olvide-password/:token', comprobarResetToken);

// Guardar nueva contraseña usando token
router.post('/olvide-password/:token', nuevoPassword);



export default router;
