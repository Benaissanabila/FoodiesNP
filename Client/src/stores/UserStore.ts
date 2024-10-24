import { defineStore } from 'pinia'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import type { IUser } from '@/shared/interfaces/UserInterface'

interface LoginResponse {
  user: IUser
  token: string
}

interface JwtPayload {
  exp?: number
  userId?: string
  role?: string
}

interface LoginResult {
  needsTwoFA: boolean
  success: boolean
  error?: string
}

export const useUserStore = defineStore('UserStore', {
  state: () => ({
    user: null as IUser | null,
    token: null as string | null,
    tempToken: '',
    twoFactorCode: '',
    loading: false,
    error: null as string | null
  }),

  actions: {
    // Authentication actions
    async createUser(formData: FormData) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post<LoginResponse>('http://localhost:3000/users', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        this.setUserAndToken(response.data.user, response.data.token)
        console.log('User created and token stored')
      } catch (error) {
        this.handleError(error, "Une erreur est survenue lors de la création de l'utilisateur")
      } finally {
        this.loading = false
      }
    },

    async loginUser(email: string, password: string): Promise<LoginResult> {
      this.loading = true
      this.error = null
      console.log('userlogin', this.user)

      try {
        // Effectuer la connexion
        const response = await axios.post('http://localhost:3000/users/login', { email, password })

        console.log('userlogin', this.user)

        // Vérifier la réponse de connexion
        if (response.data.message === 'Veuillez vérifier votre email pour le code 2FA') {
          this.tempToken = response.data.tempToken
          this.twoFactorCode = response.data.twoFactorCode
          console.log('data.twoFactorCode', this.twoFactorCode)
          console.log('temptoken temporaire ', this.tempToken)
          return { needsTwoFA: true, success: true }
        } else {
          throw new Error('Unexpected response from server')
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Gérer les erreurs spécifiques
          if (error.response?.status === 404) {
            this.error = "Utilisateur non trouvé. Vérifiez l'email."
          } else if (error.response?.data?.error === 'Failed to send 2FA code') {
            this.error = 'Unable to send 2FA code. Please try again later.'
          } else {
            this.handleError(error, 'An error occurred during login')
          }
        }
        return { needsTwoFA: false, success: false, error: this.error || 'Unknown error' }
      } finally {
        this.loading = false
      }
    },

    /*async verify2FA(code: string) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Sending 2FA verification:', code, this.tempToken);
        const response = await axios.post('http://localhost:3000/users/verify2fa', { 
          code, 
          tempToken: this.tempToken 
        });
        console.log('2FA verification response:', response.data);
        this.setUserAndToken(response.data.user, response.data.token);
        this.tempToken = null;
      } catch (error) {
        console.error('2FA verification error:', error);
        this.handleError(error, 'Invalid 2FA code');
        throw error;
      } finally {
        this.loading = false;
      }
    },*/
    setTwoFactorCode(code: string) {
      this.twoFactorCode = code
    },
    async verifyTwoFA(tempToken: string, twoFactorCode: string) {
      console.log('Code 2FA reçu:', twoFactorCode)
      console.log('Token temporaire:', tempToken)

      if (!twoFactorCode) {
        console.error('Code 2FA manquant')
        throw new Error('Le code 2FA est requis.')
      }

      try {
        const response = await axios.post(`http://localhost:3000/users/verify2fa`, {
          tempToken,
          twoFactorCode
        })

        // Vérifiez la réponse pour savoir si la vérification a réussi
        if (response.data.error) {
          console.error('Échec de la vérification 2FA:', response.data.error)
          throw new Error(response.data.error)
        } else if (response.data.accessToken) {
          console.log('Vérification 2FA réussie:', response.data)
          const { user, accessToken } = response.data // Assurez-vous que le champ s'appelle accessToken

          // Mettez à jour l'utilisateur et le token ici
          this.setUserAndToken(user, accessToken)

          // Vérifiez le format du token
          const tokenParts = accessToken.split('.')
          if (tokenParts.length !== 3) {
            throw new Error('Token JWT mal formé')
          }

          // Récupérez le header et le payload
          const [header, payload] = tokenParts

          // Décoder le header et le payload
          const decodedHeader = JSON.parse(atob(header))
          const decodedPayload = JSON.parse(atob(payload))

          console.log('Header décodé:', decodedHeader)
          console.log('Payload décodé:', decodedPayload)

          // Sauvegarder le token dans localStorage
          localStorage.setItem('userToken', accessToken)
          console.log('Token après stockage:', localStorage.getItem('userToken'))

          return true // Indique que la vérification a réussi
        } else {
          console.error('Réponse inattendue:', response.data)
          throw new Error('Réponse inattendue lors de la vérification 2FA')
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            'Erreur lors de la vérification 2FA:',
            error.response?.data || 'Erreur inconnue'
          )
          throw new Error(error.response?.data?.message || 'Erreur lors de la vérification 2FA')
        } else {
          console.error('Erreur inattendue lors de la vérification 2FA:', error)
          throw new Error('Erreur inattendue lors de la vérification 2FA')
        }
      }
    },

    logoutUser() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      console.log('User logged out')
    },

    // Token management
    // Token management
    // Token management
     async checkAuth() {
      // Essayez d'abord de récupérer le token principal
      let token = localStorage.getItem('userToken')

      // Si le userToken n'est pas trouvé, vérifiez le tempToken
      if (!token) {
        token = localStorage.getItem('tempToken') // Récupérez le tempToken si userToken est absent
      }

      if (!token) {
        console.error('Aucun token trouvé, utilisateur non connecté.')
        return false // Utilisateur non connecté
      }

      try {
        // Fonction pour décoder le token Base64Url
        const decodeBase64Url = (base64Url: string): string => {
          // Remplacer les caractères spécifiques du Base64Url
          base64Url = base64Url.replace(/-/g, '+').replace(/_/g, '/')
          // Ajouter un padding si nécessaire
          const padding = '='.repeat((4 - (base64Url.length % 4)) % 4)
          base64Url += padding
          return atob(base64Url)
        }

        const decodedPayload = decodeBase64Url(token.split('.')[1]) // Décodage du payload
        const decoded = JSON.parse(decodedPayload) // Parse le JSON décodé
        const exp = decoded.exp * 1000 // Vérifiez l'expiration

        if (Date.now() >= exp) {
          console.error('Le token a expiré, utilisateur non connecté.')
          return false // Token expiré
        }
        this.token = token
        this.user = await  this.fetchUserById(decoded.userId) // Mettez à jour l'utilisateur courant
        console.log('Utilisateur connecté:', this.user) // Assurez-vous d'utiliser `this.user` et non `this.currentUser`
        return true // Utilisateur connecté
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error)
        return false // Erreur dans le décodage
      }
    },

    async refreshToken() {
      try {
        const response = await axios.post<{ token: string }>(
          'http://localhost:3000/users/refresh-token'
        )
        this.setUserAndToken(this.user!, response.data.token)
        console.log('Token refreshed')
      } catch (error) {
        this.handleError(error, 'Error refreshing token')
        this.logoutUser()
      }
    },

    // User data management
    async updateUser(updatedUser: Partial<IUser>) {
      try {
        if (updatedUser.DOB) {
          updatedUser.DOB = new Date(updatedUser.DOB)
        }
        const response = await axios.put(
          `http://localhost:3000/users/${this.user?._id}`,
          updatedUser
        )
        this.user = response.data
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (error) {
        this.handleError(error, 'Erreur lors de la mise à jour du profil')
        throw error
      }
    },

    async deleteUser() {
      try {
        await axios.delete(`http://localhost:3000/users/${this.user?._id}`)
        this.logoutUser()
      } catch (error) {
        this.handleError(error, 'Erreur lors de la suppression du compte')
        throw error
      }
    },

    async fetchUserById(userId: string) {
      try {
        const response = await axios.get(`http://localhost:3000/users/${userId}`)
        return response.data
      } catch (error) {
        this.handleError(error, "Erreur lors de la récupération de l'utilisateur")
        throw error
      }
    },

    async updateProfilePhoto(file: File) {
      try {
        const formData = new FormData()
        formData.append('UserPhoto', file)
        const response = await axios.post(
          `http://localhost:3000/users/${this.user?._id}/photo`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        )
        if (this.user && response.data.UserPhoto) {
          this.user = { ...this.user, UserPhoto: response.data.UserPhoto }
          localStorage.setItem('user', JSON.stringify(this.user))
          console.log('Photo de profil mise à jour:', this.user.UserPhoto)
        }
      } catch (error) {
        this.handleError(error, 'Erreur lors de la mise à jour de la photo de profil')
        throw error
      }
    },

    // Utility methods
    setUserAndToken(user: any, token: string) {
      if (user && typeof user === 'object') {
        this.user = user // Update the current user
      } else {
        console.warn("L'utilisateur n'est pas un objet valide:", user)
        return // Avoid proceeding if the user is invalid
      }

      this.token = token // Store the token
      localStorage.setItem('userToken', token)
      this.user = user
      // Save the token in local storage
      console.log('Token enregistré:', token) // Log the stored token for verification
    },

    handleError(error: unknown, defaultMessage: string) {
      if (axios.isAxiosError(error)) {
        this.error = error.response?.data?.error || defaultMessage
      } else {
        this.error = defaultMessage
      }
      console.error('Error:', this.error)
    }
  },

  getters: {
    isAuthenticated(): boolean {
      return !!this.user && !!this.token
    },
    currentUser(): IUser | null {
      return this.user // Getter pour récupérer l'utilisateur actuel
    },
    getTwoFactorCode(): string {
      return this.twoFactorCode // Getter pour récupérer le twoFactorCode
    }
  }
})
