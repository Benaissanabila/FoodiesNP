export interface IComment {
    _id: string;          
    user: string;         
    reservation: string;  
    quality: number;     
    service: number;     
    ambiance: number;   
    globalRating: number;
    upvotes?: number;     
    downvotes?: number;  
    comment: string;      
    createdAt: Date;      
  }
  