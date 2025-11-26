import nodemailer from "nodemailer";

// --- CONFIGURAÇÃO GMAIL REAL ---
export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false, 
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendTemporaryPassword = async (email: string, tempPassword: string) => {
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: email, // destinatário
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
