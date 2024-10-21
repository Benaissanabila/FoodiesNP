
import * as queries from "../database/queries/owners.queries.js";

export const createOwner = async (req, res) => {
  try {
    const owner = await queries.createOwnerQuery(req.body);
    res.status(201).json(owner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOwner = async (req, res) => {
  try {
    const owner = await queries.getOwnerQuery(req.params.id);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }
    res.status(200).json(owner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllOwners = async (req, res) => {
  try {
    const owners = await queries.getAllOwnersQuery();
    res.status(200).json(owners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOwner = async (req, res) => {
  try {
    const owner = await queries.updateOwnerQuery(req.params.id, req.body);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }
    res.status(200).json(owner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOwner = async (req, res) => {
  try {
    const owner = await queries.deleteOwnerQuery(req.params.id);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }
    res.status(200).json(owner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getOwnerId = async (req, res) => {
  try {
    const owner = await queries.getOwnerIdQuery();
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }
    res.status(200).json(owner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

