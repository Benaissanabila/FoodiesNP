export interface IPlan {
    _id: string;               
    type: 'gratuit' | 'premium'; 
    price: number;             
    description?: string;                
}
  