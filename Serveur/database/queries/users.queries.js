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
export const getUserByEmailQuery = (email) => {
  return User.findOne({ email }); 
};

// Fonction pour créer un utilisateur admin
export const createAdminUserQuery = async ({ name, email, password, DOB }) => {
  const newAdmin = await User.create({ name, email, password, DOB, role: 'admin' });
  return newAdmin;
};
/*export const getUserByIdQuery = async (userId) => {
  return await User.findById(userId); 
};*/
export const updateUser2FACode = async (userId, twoFactorCode) => {
  return User.findByIdAndUpdate(userId, { twoFactorCode }, { new: true });
};
