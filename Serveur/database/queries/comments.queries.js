import Comment from "../models/comment.model.js";

// Créer un nouveau propriétaire
export const createCommentQuery = async comment => {
    return Comment.create(comment);
}

// Lire un propriétaire par ID
export const getCommentQuery = async id => {
    return Comment.findById(id)
}

// Lire tous les propriétaires
export const getAllCommentsQuery = async () => {
    return Comment.find({})
}

export const deleteCommentQuery = async id => {
    return Comment.findByIdAndDelete(id)
}

export const updateCommentQuery = async (id, comment) => {
    return Comment.findByIdAndUpdate(id, comment)
}
