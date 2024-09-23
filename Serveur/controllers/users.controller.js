import * as queries from '../database/queries/users.queries.js';

export const createUser = async (req, res) => {
  try {
    const user = await queries.createUserQuery(req.body);
    res.status(200).json(user);
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