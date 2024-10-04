import * as queries from "../database/queries/reservations.queries.js";
import { sendReservationEmail } from "../database/queries/reservations.queries.js";
import Reservation from '../database/models/reservation.model.js';


export const createReservation = async (req, res) => {
  try {
    // Récupérer les données de la requête
    const { tableId, numberOfPersons, reservationDate, user, restaurant } = req.body;

    // Créer une nouvelle réservation avec toutes les propriétés nécessaires
    const newReservation = new Reservation({
      tableId,              // ID de la table dans le restaurant
      numberOfPersons,       // Nombre de personnes pour cette réservation
      reservationDate,       // Date et heure prévues pour la réservation
      status: 'pending',     // Statut de la réservation (initialement 'pending')
      restaurant,            // ID du restaurant où la réservation a lieu
      user                   // ID de l'utilisateur qui fait la réservation 
    });

    // Sauvegarder la réservation dans la base de données
    const savedReservation = await newReservation.save();
    
    console.log("Restaurant envoyé à sendReservationEmail:", restaurant);
    // Envoyer un e-mail de confirmation après la création de la réservation
    await sendReservationEmail(user, savedReservation._id,restaurant); // Utiliser l'ID de la réservation sauvegardée

    // Répondre avec succès et renvoyer les détails de la réservation
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

