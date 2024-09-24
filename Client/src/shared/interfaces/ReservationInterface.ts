export interface IReservation {
    _id: string;                  
    tableId: number;             
    numberOfPersons: number;     
    reservationDate: Date;        
    status: 'pending' | 'confirmed' | 'cancelled';  
    restaurant: string;          
  }
  