export interface IRestaurant {
    _id: string;          
    name: string;         
    address: string;      
    cuisineType?: string; 
    schedule: string;     
    phoneNumber?: string; 
    RestoPhoto: string;   
    owner?: string;  
    globalRatingResaurant:number; 
    latitude?: number; 
    longitude?: number;  
  }
  