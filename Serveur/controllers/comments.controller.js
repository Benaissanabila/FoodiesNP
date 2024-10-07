
import * as queries from "../database/queries/comments.queries.js";
import Comment from '../database/models/comment.model.js'; 
export const createComment = async (req, res) => {
  try {
    const comment = await queries.createCommentQuery(req.body);
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getComment = async (req, res) => {
  try {
    const comment = await queries.getCommentQuery(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await queries.getAllCommentsQuery();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await queries.deleteCommentQuery(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour mettre à jour un commentaire
export const updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const updateFields = {};

    // Vérifiez si le commentaire existe
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé.' });
    }

    // Gestion des actions de vote
    if (req.body.action === 'like') {
      updateFields.upvotes = (comment.upvotes || 0) + 1; // Incrémente le like
    } else if (req.body.action === 'unlike') {
      updateFields.upvotes = Math.max((comment.upvotes || 1) - 1, 0); // Assure que upvotes reste >= 0
    } else if (req.body.action === 'dislike') {
      updateFields.downvotes = (comment.downvotes || 0) + 1; // Incrémente le dislike
    } else if (req.body.action === 'undislike') {
      updateFields.downvotes = Math.max((comment.downvotes || 1) - 1, 0); // Assure que downvotes reste >= 0
    } else if (req.body.action) {
      return res.status(400).json({ message: 'Action non supportée.' });
    }

    // Gestion des autres champs
    if (req.body.comment) updateFields.comment = req.body.comment;
    if (req.body.quality || req.body.service || req.body.ambiance) {
      const quality = req.body.quality || comment.quality;
      const service = req.body.service || comment.service;
      const ambiance = req.body.ambiance || comment.ambiance;
      updateFields.quality = quality;
      updateFields.service = service;
      updateFields.ambiance = ambiance;
      updateFields.globalRating = (quality + service + ambiance) / 3; // Recalcule le globalRating
    }

    // Mettre à jour le commentaire avec les nouveaux champs
    const updatedComment = await Comment.findByIdAndUpdate(commentId, updateFields, { new: true });
    
    return res.json(updatedComment);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du commentaire:', error);
    return res.status(500).json({
      message: 'Erreur lors de la mise à jour du commentaire.',
      error: error.message || 'Erreur inconnue',
      stack: error.stack,
    });
  }
};

