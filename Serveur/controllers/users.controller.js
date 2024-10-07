import * as queries from '../database/queries/users.queries.js';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRATION = '1h'; // Le token expirera après 1 heure

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
    res.status(200).json(updatedUser);
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
    const { email, password } = req.body;

    const user = await queries.getUserByEmailQuery(email);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    const { password: _, ...userWithoutPassword } = user._doc;

    res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
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