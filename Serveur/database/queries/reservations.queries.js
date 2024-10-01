import Reservation from "../models/reservation.model.js"; // Assurez-vous d'importer correctement le modèle Reservation from "../models/reservation.model.js";

// Créer une nouvelle reservation
export const createReservation = async (req, res) => {
    console.log("Données reçues :", req.body); // Ajoutez ceci pour voir les données entrantes
    try {
      const { tableId, numberOfPersons, reservationDate, restaurant } = req.body;
  
      // Validation des données
      if (!tableId || !numberOfPersons || !reservationDate || !restaurant) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
      }
  
      const reservation = await queries.createReservationQuery(req.body);
      res.status(201).json(reservation);
    } catch (error) {
      console.error('Erreur lors de la création de la réservation :', error);
      res.status(500).json({ error: error.message });
    }
  };
  
  
// Lire une reservation par ID
export const getReservationQuery = async (id) => {
    return Reservation.findById(id);
}

// Lire toutes les reservations
export const getAllReservationsQuery = async () => {
    return Reservation.find({});
}

export const deleteReservationQuery = async id => {
    return Reservation.findByIdAndDelete(id)
}

export const updateReservationQuery = async (id, reservation) => {
    return Reservation.findByIdAndUpdate(id, reservation)
}



