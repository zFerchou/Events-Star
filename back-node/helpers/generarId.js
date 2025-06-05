import jwt from 'jsonwebtoken';

const generarId = () => {
    const random = Math.random().toString(32).substring(2);
    const fecha = Date.now().toString(32);
    return random + fecha;
};



const generarJWT = (datos) => jwt.sign({ id: datos.id, name: datos.name }, process.env.JWT_SECRET, { expiresIn: '1d' });

export { generarId, generarJWT };