const nodemailer = require('nodemailer');

const transportador = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const send = (to, subject, body) => {
    transportador.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html: body // Altere de 'text' para 'html'
    });
};
module.exports = send;