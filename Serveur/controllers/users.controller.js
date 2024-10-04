import * as queries from '../database/queries/users.queries.js';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';

import fs from 'fs';


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
    const user = await queries.updateUserQuery(req.params.id, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await queries.deleteUserQuery(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// Fonction pour gérer la connexion de l'utilisateur
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Rechercher l'utilisateur par email
    const user = await queries.getUserByEmailQuery(email);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Comparer le mot de passe avec celui stocké en base de données
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Supprimer le mot de passe avant d'envoyer la réponse (sécurité)
    const { password: _, ...userWithoutPassword } = user._doc;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserByEmailQuery = async (email) => {
  return User.findOne({ email }).select('+password'); // Sélection explicite du champ password
};