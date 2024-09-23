import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim:true,
        minLength:[3,"Name must have at least 3 letters "]
      },
      email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Email or password invalid"],
        index: true,
      },
      password:{
        type: String,
        required: true,
        select:false,
      } 
},{timestamps:true});

export default mongoose.model('User', userSchema);

