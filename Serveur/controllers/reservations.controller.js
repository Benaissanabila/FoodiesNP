import * as queries from "../database/queries/reservations.queries.js";
import { sendReservationEmail } from "../database/queries/reservations.queries.js";
import Reservation from '../database/models/reservation.model.js';
import { sendReviewRequestEmail } from "../database/queries/reservations.queries.js";


export const createReservation = async (req, res) => {
  try {
    const { tableId, numberOfPersons, reservationDate, user, restaurant } = req.body;

    if (!tableId || !numberOfPersons || !reservationDate || !user || !restaurant) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const localReservationDate = new Date(reservationDate);
    localReservationDate.setHours(localReservationDate.getHours() - 4);
    console.log("localheur creation ", localReservationDate);

    const newReservation = new Reservation({
      tableId,
      numberOfPersons,
      reservationDate: localReservationDate,
      status: 'pending',
      restaurant,
      user
    });

    const savedReservation = await newReservation.save();
    console.log("Réservation sauvegardée:", savedReservation);

    await sendReservationEmail(user, savedReservation._id, restaurant);

    // Ici, calculer quand envoyer l'e-mail de demande d'avis
    const reservationDateTime = new Date(savedReservation.reservationDate);
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() - 4);
    
    console.log("Date actuelle moins 4 heures:", currentTime);

    // Calculer si la réservation est dans le passé ou le futur
    const timeUntilReservation = reservationDateTime - currentTime;
    console.log("Temps avant la réservation:", timeUntilReservation / 1000, "secondes");

    // Envoyer l'email de demande d'avis 24 heures après l'heure de réservation
    const emailSendTime = new Date(reservationDateTime.getTime() + 1 * 60 * 1000);

    // Si la réservation est dans le futur, alors on programme l'envoi de l'email après l'utilisation
    if (timeUntilReservation > 0) {
      const timeUntilSend = emailSendTime - currentTime;

      console.log("Envoi de l'e-mail programmé dans:", timeUntilSend / 1000, "secondes");
      setTimeout(() => {
        console.log("Envoi de l'e-mail de demande d'avis maintenant...");
        sendReviewRequestEmail(user, savedReservation._id, restaurant);
      }, timeUntilSend);

    } else {
      // Si la réservation est déjà passée (ou très proche), envoyer l'e-mail immédiatement
      console.log("La réservation est passée, envoi immédiat de l'e-mail.");
      await sendReviewRequestEmail(user, savedReservation._id, restaurant);
    }

    res.status(201).json({
      message: 'Réservation créée avec succès et e-mail envoyé',
      reservation: savedReservation,
    });

  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la réservation' });
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

export const updateReservation = async (req, res) => {
  try {
    const reservation = await queries.updateReservationQuery(
      req.params.id,
      req.body
    );
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const reservation = await queries.deleteReservationQuery(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserReservations = async (req, res) => {
  try {
    const userId = req.params.userId; // Récupération de l'ID de l'utilisateur depuis les paramètres de l'URL
    const reservations = await queries.getReservationsByUserId(userId); // Requête pour trouver les réservations de cet utilisateur

    if (!reservations || reservations.length === 0) {
      return res.status(404).json({ message: "Aucune réservation trouvée pour cet utilisateur." });
    }

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


