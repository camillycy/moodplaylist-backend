//usercontroller

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import path from "path";
import fs from "fs";
import { error } from "console";
import crypto from "crypto"
import { transporter } from "../utils/mailer";


// ====================
// CADASTRO DE USUÁRIO
// ====================
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword, birthDate } = req.body;

    if (!name || !email || !password || !confirmPassword || !birthDate) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "As senhas não coincidem" });
    }

    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    if (age < 14) return res.status(400).json({ error: "Usuário deve ter pelo menos 14 anos" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "E-mail já cadastrado" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      birthDate,
      createdAt: new Date(),
    });

    return res.status(201).json({ message: "Usuário criado com sucesso!", user: newUser });
  } catch (err) {
    console.error("❌ Erro ao criar usuário:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

// ====================
// LOGIN DE USUÁRIO
// ====================
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Email e senha são obrigatórios" });

    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(400).json({ error: "Usuário não encontrado" });

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) return res.status(400).json({ error: "Senha incorreta" });

    return res.json({ message: "Login bem-sucedido!", user: existingUser });
  } catch (err) {
    console.error("❌ Erro no login:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

// ====================
// LISTAR TODOS OS USUÁRIOS
// ====================
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

// ====================
// BUSCAR USUÁRIO POR ID
// ====================
export const getUserById = async (req: Request, res: Response) => {
  console.log("ID recebido:", req.params.id); // <<< log
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(user);
  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};


// ====================
// ATUALIZAR FOTO DE PERFIL
// ====================
export const updateProfilePicture = async (req: Request, res: Response) => {

    console.log("📥 RECEBIDO update-profile-picture");
  console.log("req.file =", req.file);
  console.log("req.body =", req.body);
  try {
    const { userId, imageUrl } = req.body;

    if (!userId || !imageUrl) {
      return res.status(400).json({ error: "userId e imageUrl são obrigatórios" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    // remover imagem antiga
if (user.profilePicture) {
  try {
    const oldFileName = path.basename(user.profilePicture);
    const oldPath = path.join(__dirname, "..", "uploads", oldFileName);

    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
      console.log("🗑 Foto antiga removida:", oldFileName);
    }
} catch (err) {
  const error = err as Error;
  console.log("⚠ Erro ao remover foto antiga (IGNORADO):", error.message);
}

}

    user.profilePicture = imageUrl;
    await user.save();

    return res.json({
      message: "Foto de perfil atualizada!",
      profilePicture: imageUrl
    });

  } catch (err) {
    console.error("❌ Erro ao atualizar foto de perfil:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};


// ====================
// DELETAR FOTO DE PERFIL
// ====================
export const deleteProfilePicture = async (req: Request, res: Response) => {
  try {

    console.log("BODY RECEBIDO NO DELETE:", req.body);

    const { userId } = req.body;

    if (!userId)
      return res.status(400).json({ error: "userId é obrigatório" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ error: "Usuário não encontrado" });

    // Se existir foto anterior, apaga do servidor
    if (user.profilePicture) {
      const fileName = path.basename(user.profilePicture);
      const filePath = path.join(__dirname, "..", "uploads", fileName);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Voltar para sem foto
    user.profilePicture = null;
    await user.save();

    return res.json({
      message: "Foto removida com sucesso!",
      profilePicture: null
    });

  } catch (err) {
    console.error("❌ Erro ao deletar foto:", err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

// ====================
// ATUALIZAR EMAIL E SENHA
// ====================
export const updateEmailOrPassword = async (req: Request, res: Response) => {
  try {
    const { userId, email, oldPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId é obrigatório" });
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const updateFields: any = {};

    if (email) {
      const emailExists = await User.findOne({ email });
    if (emailExists && (emailExists as any)._id.toString() !== userId) {
        return res.status(400).json({ error: "Este email já está em uso" });
      }
      updateFields.email = email;
    }

    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ error: "Senha atual é obrigatória para mudar a senha" });
      }

      const passwordMatch = await bcrypt.compare(oldPassword, existingUser.password);
      if (!passwordMatch) {
        return res.status(400).json({ error: "Senha atual incorreta" });
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      updateFields.password = hashed;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    ) as any;

    return res.json({
      message: "Dados atualizados com sucesso!",
      userId: updatedUser?._id
    });

  } catch (err) {
    console.error("❌ Erro ao atualizar email/senha:", err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

// ====================
// ENVIAR SENHA PROVISÓRIA

export const sendTempPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "E-mail é obrigatório" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const tempPassword = crypto.randomBytes(4).toString("hex");

    user.password = await bcrypt.hash(tempPassword, 10);
    await user.save();

    const mailOptions = {
      from: '"VibeLog" <vibelogapp@gmail.com>',
      to: user.email,
      subject: "Senha provisória",
      text: `Olá ${user.name}, sua senha provisória é: ${tempPassword}\nUse esta senha para entrar e altere imediatamente após o login.`,
      html: `<p>Olá <b>${user.name}</b>,</p>
             <p>Sua senha provisória é: <b>${tempPassword}</b></p>
             <p>Use esta senha para entrar e altere imediatamente após o login.</p>`
    };

    await transporter.sendMail(mailOptions);

    return res.json({ message: "Senha provisória enviada por e-mail!" });

  } catch (err) {
    console.error("❌ Erro ao enviar senha provisória:", err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};