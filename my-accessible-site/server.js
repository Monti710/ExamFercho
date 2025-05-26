const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configura la carpeta estática (React build)
app.use(express.static(path.join(__dirname, "client/build")));

// Endpoint para recibir datos del formulario y enviar correo
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  // Configura el transporte de nodemailer usando Gmail
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mayelomonti1@gmail.com", // Cambia por tu correo
      pass: "oomq xtll kclm bzgf",    // Usa app password si tienes 2FA
    },
  });

  // Opciones para el correo al destinatario principal
  const mailOptionsToRecipient = {
    from: "mayelomonti1@gmail.com",  // Mejor usar correo autorizado como remitente
    to: "imontiel@ucol.mx",          // Correo que recibe el mensaje
    subject: `Nuevo mensaje de contacto de ${name}`,
    text: `Mensaje de ${name} <${email}>:\n\n${message}`,
    replyTo: email,                  // Responder a correo del usuario
  };

  // Opciones para el correo de confirmación al usuario
  const mailOptionsToUser = {
    from: "mayelomonti1@gmail.com",  // Mismo correo autorizado
    to: email,                       // Correo del usuario que envió el mensaje
    subject: "Gracias por contactarnos :)",
    text: `Hola ${name},

Gracias por enviarnos tu mensaje. Hemos recibido lo que nos escribiste y te responderemos lo antes posible.

Tu mensaje fue:
"${message}"

Saludos cordiales,
El equipo de atención al cliente`,
  };

  try {
    // Enviar correo al destinatario principal
    await transporter.sendMail(mailOptionsToRecipient);
    // Enviar correo de confirmación al usuario
    await transporter.sendMail(mailOptionsToUser);

    res.status(200).json({ message: "Correo enviado con éxito y confirmación enviada al usuario" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al enviar el correo" });
  }
});

// Redirige todas las rutas a React
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server corriendo en puerto ${port}`);
});
