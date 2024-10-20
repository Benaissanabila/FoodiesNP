export interface IRestaurant {
    _id: string;          
    name: string; 
    comments?:[];        
    address: string;      
    cuisineType?: string; 
    schedule: object;     
    phoneNumber?: string; 
    RestoPhoto: string | null | File;   
    owner?: string;  
    globalRatingResaurant:number; 
    latitude?: number; 
    longitude?: number; 
    description:string 
    priceFork:string
  }
  