import Reservation from "../models/reservation.model.js"; // Assurez-vous d'importer correctement le modèle Reservation from "../models/reservation.model.js";

// Créer une nouvelle reservation
export const createReservationQuery = async (reservation) => {
    return Reservation.create(reservation);
}

// Lire une reservation par ID
export const getReservationQuery = async (id) => {
    return Reservation.findById(id);
}

// Lire toutes les reservations
export const getAllReservationsQuery = async () => {
    return Reservation.find({});
}