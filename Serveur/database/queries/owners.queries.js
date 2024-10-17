import { Owner } from "../models/owner.model.js";

// Créer un nouveau propriétaire
export const createOwnerQuery = async owner => {
    return Owner.create(owner);
}

// Lire un propriétaire par ID
export const getOwnerQuery = async id => {
    return Owner.findById(id)
}

export const getOwnerByUser = async id => {
    return Owner.findOne({user: id})
}

// Lire tous les propriétaires
export const getAllOwnersQuery = async () => {
    return Owner.find({})
}
export const deleteOwnerQuery = async id => {
    return Owner.findByIdAndDelete(id)
}

export const updateOwnerQuery = async (id, owner) => {
    return Owner.findByIdAndUpdate(id, owner)
}