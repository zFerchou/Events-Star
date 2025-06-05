const checkRole = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario || !rolesPermitidos.includes(req.usuario.role)) {
            return res.status(403).json({
                status: 'error',
                msg: 'Acceso denegado: rol no autorizado',
                data: null
            });
        }
        next();
    };
};

export default checkRole;