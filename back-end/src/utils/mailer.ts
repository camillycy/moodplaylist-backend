import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // senha de app
  },
});

export const sendTemporaryPassword = async (email: string, tempPassword: string) => {
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Redefinição de senha",
    text: `Sua senha provisória é: ${tempPassword}\nUse esta senha para fazer login e alterá-la imediatamente.`,
    html: `<p>Sua senha provisória é: <b>${tempPassword}</b></p>
           <p>Use esta senha para fazer login e alterá-la imediatamente.</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail enviado:", info.response);
    return true;
  } catch (err) {
    console.error("Erro ao enviar e-mail:", err);
    return false;
  }
};
