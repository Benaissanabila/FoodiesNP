import * as queries from '../database/queries/users.queries.js';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../database/models/user.model.js'; 


const JWT_SECRET = '6bcc26158864fc481c2a5b1e23356c7117701bf9d2c9f3999f6b3f3476bb70eae5cbd1c5c579e537b77e3558bcadebf9230b57890f2a212c0fd752a567281642'
const TOKEN_EXPIRATION = '1h'; 

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
export const verifyRole = (role) => {
  return (req, res, next) => {
    if (req.userId) {
      User.findById(req.userId)
        .then(user => {
          if (!user || user.role !== role) {
            return res.status(403).json({ error: 'Access denied' });
          }
          next();
        })
        .catch(error => res.status(500).json({ error: error.message }));
    } else {
      return res.status(401).json({ error: 'No token provided' });
    }
  };
};


export default transporter;

// Fonction pour générer un code 2FA
const generateRandomCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
};

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
    const { email, password } = req.body;
    let user = await queries.getUserByEmailQuery(email).select('+twoFactorCode'); // Sélectionner explicitement twoFactorCode

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Générer le code 2FA
    const twoFactorCode = generateRandomCode();
    user.twoFactorCode = twoFactorCode;

    // Sauvegarder le code 2FA dans la base de données
    await user.save();

    // Recharger l'utilisateur avec le code 2FA mis à jour
    user = await queries.getUserByEmailQuery(email).select('+twoFactorCode');
console.log("usssser",user)
    // Générer un token temporaire pour l'authentification
    const tempToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // Envoyer l'email avec le code 2FA
    const emailSent = await sendTwoFactorCode(user.email, user.twoFactorCode);
    if (!emailSent) {
      return res.status(500).json({ error: 'Failed to send 2FA code' });
    }

    res.status(200).json({ message: 'Veuillez vérifier votre email pour le code 2FA', tempToken,twoFactorCode: user.twoFactorCode  });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Fonction pour vérifier le code 2FA et générer le token d'accès complet
export const verify2FA = async (req, res) => {
  const { tempToken, twoFactorCode } = req.body;

  // Vérification des paramètres requis
  if (!tempToken || !twoFactorCode) {
    return res.status(400).json({ error: 'Temp token and 2FA code are required' });
  }

  try {
    const decoded = jwt.verify(tempToken, JWT_SECRET);
    const user = await queries.getUserQuery(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.twoFactorCode !== twoFactorCode) {
      return res.status(403).json({ error: 'Invalid 2FA code' });
    }
    
    const accessToken = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({ message: 'Authentication successful', accessToken });
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Invalid or expired temp token' });
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




export const createAdminUser = async (req, res) => {
  const { name, email, password, DOB } = req.body;

  // Vérifiez que les champs requis sont présents
  if (!name || !email || !password || !DOB) {
    return res.status(400).json({ error: "Les champs name, email, password et DOB sont requis." });
  }

  try {
    // Créez un nouvel utilisateur admin en utilisant la requête
    const newAdmin = await queries.createAdminUserQuery({ name, email, password, DOB });

    // Excluez le mot de passe de la réponse
    newAdmin.password = undefined;

    // Générer le token JWT pour l'utilisateur admin créé
    const accessToken = jwt.sign({ userId: newAdmin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });

    // Inclure le token dans la réponse
    res.status(201).json({ newAdmin, accessToken }); // Renvoie l'utilisateur admin et le token
  } catch (error) {
    console.error('Erreur lors de la création de l’administrateur :', error);
    res.status(500).json({ error: error.message });
  }
};


  export const refreshToken = (req, res) => {
      const token = req.headers['authorization']?.split(' ')[1]; // Extraire le token de l'en-tête Authorization

      if (!token) {
          return res.status(403).json({ error: 'Token not provided' });
      }

      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
          if (err) {
              return res.status(401).json({ error: 'Unauthorized' });
          }

          // Si le token est valide, générez un nouveau token
          const newToken = generateToken(decoded.userId); // Utiliser l'ID de l'utilisateur du token décodé

          return res.json({ token: newToken });
      });
    }
    const generateToken = (userId) => {
      return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' }); // Ajustez la durée d'expiration si nécessaire
  };
  

  export const getUserByEmail = async (req, res) => {
    try {
      const { email } = req.params; 
      const user = await queries.getUserByEmailQuery(email); // Assurez-vous que cette fonction est définie dans votre fichier de requêtes
  
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

