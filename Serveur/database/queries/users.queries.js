import User from '../models/user.model.js'; 

// Créer un utilisateur
export const createUserQuery = async (userData) => {
  return User.create(userData);
};

// Récupérer tous les utilisateurs
export const getUsersQuery = async () => {
  return User.find({});
};

// Récupérer un utilisateur par ID
export const getUserQuery = async (id) => {
  return User.findById(id).select('+twoFactorCode');
};

export const deleteUserQuery = async id => {
  return User.findByIdAndDelete(id)
}

export const updateUserQuery = async (id, user) => {
  return User.findByIdAndUpdate(id, user)
}
export const getUserByEmailQuery = async (email) => {
  return User.findOne({ email }).select('+password +twoFactorCode');
};