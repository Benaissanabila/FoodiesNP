export interface IUser {
    _id?: string;           
    name: string;          
    email: string;         
    password?: string;     
    UserPhoto?: string;    
    DOB: string | Date; 
    role?: string;          
  twoFactorCode?: string;  
  tempToken?: string;          
  }
  