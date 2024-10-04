import Reservation from "../models/reservation.model.js"; // Assurez-vous d'importer correctement le modèle Reservation from "../models/reservation.model.js";
import nodemailer from 'nodemailer';
import User from '../models/user.model.js'
import {Restaurant}  from '../models/restaurant.model.js'
import dotenv from 'dotenv';
dotenv.config();


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

export const deleteReservationQuery = async id => {
    return Reservation.findByIdAndDelete(id)
}


export const updateReservationQuery = async (id, reservation) => {
    return Reservation.findByIdAndUpdate(id, reservation)
}


// Fonction pour envoyer un email de réservation
export const sendReservationEmail = async (userId, reservationId,restaurantId) => {
   
    
    // Créer un transporteur SMTP
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com', // Serveur SMTP
        port: 587, // Port
        secure: false, // true pour le port 465, false pour les autres ports
        auth: {
            user: process.env.SMTP_USER, // Ton identifiant
            pass:  process.env.SMTP_PASS, // Remplace par ton mot de passe SMTP
        },
    });

    try {
        // Récupérer l'utilisateur par ID
        const user = await User.findById(userId);
        if (!user || !user.email) {
            throw new Error("Adresse email invalide");
        }
        
        // Récupérer le restaurant par ID
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            throw new Error("Restaurant introuvable");
        }
        
// Récupérer la réservation par ID
const reservation = await Reservation.findById(reservationId);
if (!reservation ) {
    throw new Error("Détails de la réservation ou du restaurant manquants");
}
console.log('reservation récupéré:', reservation. reservationDate);
// Formater la date et l'heure
 // Formater la date et l'heure
 const reservationDate = new Date(reservation.reservationDate);
 const optionsDate = {
     year: 'numeric',
     month: 'long',
     day: 'numeric'
 };
 const optionsTime = {
     hour: '2-digit',
     minute: '2-digit',
     hour12: false,
     timeZone: 'America/New_York' // Change cela selon ton fuseau horaire
 };

 // Utiliser 'fr-FR' pour le format français
 const formattedDate = reservationDate.toLocaleDateString('fr-FR', optionsDate).replace(',', '');
 const formattedTime = reservationDate.toLocaleTimeString('fr-FR', optionsTime);

        // Définir les options de l'email
        const mailOptions = {
            from: 'foodies.n.p.2024@gmail.com',
            to: user.email, // Utiliser l'email de l'utilisateur récupéré
            subject: 'Confirmation de réservation',
            html: `<p>Bonjour ,<strong>${user.name}</strong> </p>
                   <p>Félicitations ! Votre réservation pour <strong>${reservation.numberOfPersons} personnes</strong> à <strong>${formattedTime}</strong> le <strong>${formattedDate}</strong> au restaurant <strong>${restaurant.name}</strong> est confirmée.</p>
`,
        };

        // Envoyer l'email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email envoyé avec succès :', info.response);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email :', error);
    }
};




