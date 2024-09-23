import { Owner } from "../models/owner.model.js";

// Créer un nouveau propriétaire
export const createOwnerQuery = async owner => {
    return Owner.create(owner);
}

// Lire un propriétaire par ID
export const getOwnerQuery = async id => {
    return Owner.findById(id)
}

// Lire tous les propriétaires
export const getAllOwnersQuery = async () => {
    return Owner.find({})
}