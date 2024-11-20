const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');


function send(from, pass, message) {
    const to = 'rozelstas@gmail.com';

    let transporter = nodemailer.createTransport(smtpTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
            user: from,
            pass: pass
        }

    }));

    var mailOptions = {
        from: from,
        to: to,
        subject: 'Отправка писем',
        text: message,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
};

module.exports = { send };