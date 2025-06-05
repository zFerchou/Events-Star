import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    console.log(datos);
    const { email, name, token } = datos;
    const domainn = 'EventStar.com'

    const subject = `Confirma tu Cuenta en ${domainn}`;
    const text = `Confirma tu Cuenta en ${domainn} ahora:`;
    const reff = process.env.E_BACKEND_URL;
    const html = `
        <></>
        <p>Hola ${name}, comprueba tu cuenta en ${domainn}</p>
        <p>Tu cuenta ya esta casi lista, solo debes confirmarla en el siguiente enlace: 
        <a href="${reff}:${process.env.B_PORT}/users/confirmar/${token}" >Confirmar Cuenta</a> </p>
        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    `;
    //Enviar
    await transport.sendMail({
        from: domainn, //quie?
        to: email, //para quien?
        subject, //asunto
        text,
        html
    })


};

const emailOlvidePass = async (datos) => {
    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    console.log(datos);
    const { email, name, token } = datos;
    const domainn = 'EventStar.com'


    const subject = `Reestablece tu password en ${domainn}`;
    const text = `Reestablece tu password en ${domainn} ahora:`;
    const reff = process.env.E_BACKEND_URL;
    const html = `
        <></>
        <p>Hola ${name}, haz solicitado cambiar tu password en ${domainn}</p>
        <p>Sigue el siguiente enlace para generar un password nuevo:
        <a href="${reff}:${process.env.B_PORT}/users/olvide-password/${token}" >Reestablecer Password</a> </p>
        <p>Si tu no solicitaste el cambio de contraseña, puedes ignorar el mensaje</p>
    `;
    //Enviar
    await transport.sendMail({
        from: domainn, //quie?
        to: email, //para quien?
        subject, //asunto
        text,
        html
    })


};



export {
    emailRegistro,
    emailOlvidePass
}