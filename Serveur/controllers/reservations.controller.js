import * as queries from "../database/queries/reservations.queries.js";

export const createReservation = async (req, res) => {
  try {
    const reservation = await queries.createReservationQuery(req.body);
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReservation = async (req, res) => {
  try {
    const reservation = await queries.getReservationQuery(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllReservations = async (req, res) => {
  try {
    const reservations = await queries.getAllReservationsQuery();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};