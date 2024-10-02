// src/stores/reservationStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import type { IReservation } from '@/shared/interfaces/ReservationInterface';

export const useReservationStore = defineStore('reservation', {
  state: () => ({
    reservations: [] as IReservation[], // List of reservations
    currentReservation: null as IReservation | null, // Single reservation
    loading: false, // To manage loading state
    error: null as string | null, // Error message
  }),

  actions: {
    // Fetch all reservations
    async fetchReservations() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:3000/reservations');
        this.reservations = response.data; // Assuming the API returns an array of reservations
      } catch (error) {
        this.error = 'Failed to fetch reservations';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // Fetch a reservation by ID
    async fetchReservationById(id: string) {
      this.loading = true;
      try {
        const response = await axios.get(`http://localhost:3000/reservations/${id}`);
        this.currentReservation = response.data; // Assuming the API returns a single reservation object
      } catch (error) {
        this.error = `Failed to fetch reservation with ID ${id}`;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // Create a new reservation
    // Create a new reservation
    async createReservation(payload: { tableId: number; numberOfPersons: number; reservationDate: string; restaurant: string }) {
      try {
        const response = await axios.post('http://localhost:3000/reservations', payload);
        this.reservations.push(response.data); // Ajoutez la nouvelle réservation à la liste
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.error = error.response?.data.message || 'Erreur lors de la création de la réservation';
        } else {
          this.error = 'Erreur lors de la création de la réservation';
        }
        console.error('Erreur lors de la création de la réservation :', error);
      }
    },

   
    // Update an existing reservation
    async updateReservation(id: string, reservation: IReservation) {
      this.loading = true;
      try {
        const response = await axios.put(`http://localhost:3000/reservations/${id}`, reservation);
        const index = this.reservations.findIndex((r) => r._id === id);
        if (index !== -1) {
          this.reservations[index] = response.data;
        }
      } catch (error) {
        this.error = `Failed to update reservation with ID ${id}`;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // Delete a reservation
    async deleteReservation(id: string) {
      this.loading = true;
      try {
        await axios.delete(`http://localhost:3000/reservations/${id}`);
        this.reservations = this.reservations.filter((r) => r._id !== id);
      } catch (error) {
        this.error = `Failed to delete reservation with ID ${id}`;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // Clear error
    clearError() {
      this.error = null;
    },

    
  },
});
