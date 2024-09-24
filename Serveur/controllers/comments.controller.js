
import * as queries from "../database/queries/comments.queries.js";

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

export const updateComment = async (req, res) => {
  try {
    const comment = await queries.updateCommentQuery(req.params.id, req.body);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 




