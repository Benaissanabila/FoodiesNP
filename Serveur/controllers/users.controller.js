import * as queries from '../database/queries/users.queries.js';
import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
  try {
    const user = await queries.createUserQuery(req.body);
    res.status(200).json(user); // Retourne l'utilisateur créé
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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