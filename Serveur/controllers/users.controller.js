import * as queries from '../database/queries/users.queries.js';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';


const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRATION = '1h'; // Le token expirera après 1 heure

const EMAIL = 'foodies.n.p.2024@gmail.com';
const PASSWORD = 'qjkf surl yimr onpj';

// Configuration de NodeMailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export default transporter;

// Fonction pour générer un code 2FA
function generateTwoFactorCode() {
  return crypto.randomInt(100000, 999999).toString();
}

// Fonction pour envoyer le code 2FA par email
async function sendTwoFactorCode(email, code) {
  console.log('Attempting to send 2FA code to:', email);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Votre code d\'authentification à deux facteurs',
    text: `Votre code d'authentification est : ${code}`
  };

  try {
    console.log('Email configuration:', JSON.stringify(mailOptions));
    console.log('Transporter configuration:', JSON.stringify(transporter.options));
    await transporter.sendMail(mailOptions);
    console.log('Email 2FA envoyé avec succès');
    return true;
  } catch (error) {
    console.error('Erreur détaillée lors de l\'envoi de l\'email 2FA:', error);
    return false;
  }
}

// Configurer le stockage de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    // Vérifier si le dossier existe, sinon le créer
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Crée le dossier si nécessaire
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Renommer l'image avec un nom unique
  }
});

const upload = multer({ storage: storage });


export const createUser = [
  upload.single('UserPhoto'),
  async (req, res) => {
    try {
      console.log("Body:", req.body);
      console.log("File:", req.file);

      const { name, email, password, DOB } = req.body;
      const userPhoto = req.file ? req.file.filename : null; // Stocke uniquement le nom du fichier

      const user = await queries.createUserQuery({
        name,
        email,
        password,
        DOB,
        UserPhoto: userPhoto,
      });

      console.log("Created user:", user); // Log pour vérifier les données stockées

      res.status(200).json(user);
    } catch (error) {
      console.error("Error during user creation:", error);
      res.status(500).json({ error: error.message });
    }
  }
];


export const getUsers = async (req, res) => {
  try {
    const users = await queries.getUsersQuery();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await queries.getUserQuery(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Empêcher la mise à jour du mot de passe via cette route
    delete updateData.password;

    const updatedUser = await queries.updateUserQuery(id, updateData);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Force la récupération des données mises à jour depuis la base
    const refreshedUser = await queries.getUserQuery(id);

    res.status(200).json(refreshedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateProfilePhoto = [
  upload.single('UserPhoto'),
  async (req, res) => {
    try {
      const userId = req.params.id;
      const photoPath = req.file.filename;

      const updatedUser = await queries.updateUserQuery(userId, { UserPhoto: photoPath });
      
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      console.log('Photo updated for user:', updatedUser);
      res.status(200).json({ UserPhoto: photoPath });
    } catch (error) {
      console.error('Error updating profile photo:', error);
      res.status(500).json({ error: error.message });
    }
  }
];

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await queries.deleteUserQuery(id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User successfully deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Fonction pour gérer la connexion de l'utilisateur
export const loginUser = async (req, res) => {
  try {
    console.log('Login attempt for:', req.body.email);
    const { email, password } = req.body;
    const user = await queries.getUserByEmailQuery(email);
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log('Invalid credentials');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('Generating 2FA code');
    const twoFactorCode = generateTwoFactorCode();
    console.log('2FA code generated:', twoFactorCode);

    user.twoFactorCode = twoFactorCode;
    await user.save();
    console.log('2FA code saved to user');

    console.log('Attempting to send 2FA email');
    const emailSent = await sendTwoFactorCode(user.email, twoFactorCode);
    
    if (!emailSent) {
      console.error('Failed to send 2FA email');
      return res.status(500).json({ error: 'Failed to send 2FA code' });
    }

    console.log('2FA email sent successfully');
    const tempToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '5m' });

    res.status(200).json({ message: 'Veuillez vérifier votre email pour le code 2FA', tempToken });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ error: error.message });
  }
};
// Ajouter une nouvelle fonction pour vérifier le code 2FA
export const verify2FA = async (req, res) => {
  try {
    console.log('Verifying 2FA code:', req.body.code);
    const { code, tempToken } = req.body;
    const decoded = jwt.verify(tempToken, JWT_SECRET);
    const user = await queries.getUserQuery(decoded.userId);

    console.log('User found:', user ? 'Yes' : 'No');
    console.log('Stored 2FA code:', user.twoFactorCode);
    console.log('Received 2FA code:', code);

    if (!user || user.twoFactorCode !== code) {
      console.log('Invalid 2FA code');
      return res.status(401).json({ error: 'Invalid 2FA code' });
    }

    // Réinitialiser le code 2FA
    user.twoFactorCode = null;
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

    const { password: _, ...userWithoutPassword } = user._doc;
    res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Error in verify2FA:', error);
    res.status(500).json({ error: error.message });
  }
};

export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const getUserByEmailQuery = async (email) => {
  return User.findOne({ email }).select('+password'); // Sélection explicite du champ password
};