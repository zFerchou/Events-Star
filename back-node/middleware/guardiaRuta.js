import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const checkAuth = async (req, res, next) => {
    const token = req.cookies._jwtn;

    if (!token) {
        return res.status(401).json({
            status: 'error',
            msg: 'No estás autenticado',
            data: null
        });
    }

    try {
        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar al usuario
        const usuario = await Usuario.findById(decoded.id).select('-pass -token');

        if (!usuario) {
            return res.status(401).json({
                status: 'error',
                msg: 'Token inválido: el usuario no existe',
                data: null
            });
        }

        // Adjuntar usuario autenticado al request
        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            status: 'error',
            msg: 'Token inválido o expirado',
            data: null
        });
    }
};

export default checkAuth;
