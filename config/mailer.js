let nodemailer = require('nodemailer')
require('dotenv').config(); //Para que las ENV sean alcanzables

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true para 465, falso para cualquier otro
    auth: {
      user: 'pleiaspace@gmail.com', // generated user
      pass: process.env.MAIL_PSSWD // generated password
    }
})

module.exports = transporter;