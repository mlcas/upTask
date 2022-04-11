import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;
  // esto me lo traigo de Mailtrap
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Informacion del email
  const info = await transport.sendMail({
    from: '"UpTask - Adminstrador de Proyectos" <cuentas@uptask.com',
    to: email,
    subject: "UpTask - Comprueba tu cuenta",
    text: "Comprueba tu cuenta en UpTask",
    html: `<p>Hola: ${nombre} Comprueba tu cuenta en UpTask</p>
      <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:
      <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
      
      <p>Si tu no creaste la cuenta, puedes ignorar el mensaje</p>
      `,
  });
};

export const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;
  // esto me lo traigo de Mailtrap
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Informacion del email
  const info = await transport.sendMail({
    from: '"UpTask - Adminstrador de Proyectos" <cuentas@uptask.com',
    to: email,
    subject: "UpTask - Reestable Tu Password",
    text: "Reestable Tu Password",
    html: `<p>Hola: ${nombre} has solicitado reestablecer tu Password</p>
      <p>Sigue el  siguiente enlace para reestablecer tu Password :
      <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
      
      <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
      `,
  });
};
