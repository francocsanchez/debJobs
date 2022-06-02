const configEmail = require('../config/email');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const util = require('util');

var transport = nodemailer.createTransport({
    host: configEmail.host,
    port: configEmail.port,
    auth: {
        user: configEmail.user,
        pass: configEmail.pass
    }
});

transport.use('compile', hbs({
    viewEngine: {
        extname: 'handlebars',
        defaultLayout: false,
    },
    viewPath: __dirname + '/../views/emails',
    extName: '.handlebars',
}));


exports.enviar = async (opciones) => {
    const opcionesEmail = {
        from: 'DevJobs <noreplay@devjobs.com>',
        to: opciones.user.email,
        subject: opciones.subject,
        template: opciones.file,
        context: {
            resetUrl: opciones.resetUrl
        }
    }

    const sendEmail = util.promisify(transport.sendMail, transport)
    return sendEmail.call(transport, opcionesEmail);
}