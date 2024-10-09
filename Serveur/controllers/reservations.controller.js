import * as queries from "../database/queries/reservations.queries.js";
import { sendReservationEmail } from "../database/queries/reservations.queries.js";
import Reservation from '../database/models/reservation.model.js';
import { sendReviewRequestEmail } from "../database/queries/reservations.queries.js";


export const createReservation = async (req, res) => {
  try {
    // Récupérer les données de la requête
    const { tableId, numberOfPersons, reservationDate, user, restaurant } = req.body;

    // Vérifiez que les données requises sont présentes
    if (!tableId || !numberOfPersons || !reservationDate || !user || !restaurant) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    // Convertir la date de réservation (qui doit être au format UTC) en heure locale (GMT-4)
    const localReservationDate = new Date(reservationDate);

    // Diminuer 4 heures
    localReservationDate.setHours(localReservationDate.getHours() - 4);
    console.log("localheur creation ", localReservationDate);

    // Créer une nouvelle réservation avec toutes les propriétés nécessaires
    const newReservation = new Reservation({
      tableId,              // ID de la table dans le restaurant
      numberOfPersons,       // Nombre de personnes pour cette réservation
      reservationDate: localReservationDate, // Date et heure prévues pour la réservation (en UTC)
      status: 'pending',     // Statut de la réservation (initialement 'pending')
      restaurant,            // ID du restaurant où la réservation a lieu
      user                   // ID de l'utilisateur qui fait la réservation 
    });

    // Sauvegarder la réservation dans la base de données
    const savedReservation = await newReservation.save();
    console.log("Réservation sauvegardée:", savedReservation);

    // Envoyer un e-mail de confirmation après la création de la réservation
    await sendReservationEmail(user, savedReservation._id, restaurant);
    console.log("E-mail de confirmation envoyé à l'utilisateur:", user);

    // Calculer la date d'envoi de l'email
    const reservationDateTime = new Date(savedReservation.reservationDate);
    const emailSendTime = new Date(reservationDateTime.getTime() +1* 60 * 1000); // Ajoute 5 heures
    console.log("Date et heure de la réservation:", reservationDateTime);
    console.log("L'e-mail sera envoyé à:", emailSendTime);

    const currentTime = new Date(); // Date actuelle
   
    currentTime.setHours(currentTime.getHours() - 3);
     console.log("Date actuelle:", currentTime); 
    const timeUntilSend = emailSendTime - currentTime; 
    console.log("Temps jusqu'à l'envoi de l'e-mail (ms):", timeUntilSend);

    // Vérification si le jour, mois et année de la réservation correspondent à la date actuelle
    const isSameDay = reservationDateTime.getDate() === currentTime.getDate() &&
                      reservationDateTime.getMonth() === currentTime.getMonth() &&
                      reservationDateTime.getFullYear() === currentTime.getFullYear();

    // Vérifier si le temps jusqu'à l'envoi est positif
    if (timeUntilSend > 0) {
        console.log("Envoi de l'e-mail programmé dans:", timeUntilSend / 1000, "secondes");
        setTimeout(() => {
            console.log("Envoi de l'e-mail de demande d'avis maintenant...");
            if (isSameDay) {
                sendReviewRequestEmail(user, savedReservation._id, restaurant);
            } else {
                console.log("La date de la réservation n'est pas le même jour que la date actuelle, pas d'envoi d'avis.");
            }
        }, timeUntilSend);
    } else {
        console.log("Le temps d'envoi est déjà passé, envoi immédiat de l'e-mail.");
        if (isSameDay) {
            await sendReviewRequestEmail(user, savedReservation._id, restaurant);
        } else {
            console.log("La date de la réservation n'est pas le même jour que la date actuelle, pas d'envoi d'avis.");
        }
    }

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

