let nodemailer = require('nodemailer')
require('dotenv').config(); //Para que las ENV sean alcanzables

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'pleiaspace@gmail.com', // generated ethereal user
      pass: process.env.MAIL_PSSWD // generated ethereal password
    }
})

module.exports = transporter;

// transporter.verify().then(()=>{
//     console.log('Listo para enviar emails')
// })