import type { IComment } from "./CommentInterface";

export interface IRestaurant {
    _id: string;          
    name: string; 
    comments?:IComment[];        
    address: string;      
    cuisineType?: string; 
    schedule: Object;    
    phoneNumber?: string; 
    RestoPhoto: string | null | File;   
    owner?: string;  
    globalRatingResaurant:number; 
    latitude?: number; 
    longitude?: number; 
    description:string 
    priceFork:string
  }

  
  