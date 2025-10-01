import { Schema,Document,Model } from "mongoose";
export interface IUser extends Document{
    username:String;
    email:string;
    password:string;
    accessToken:string;
}
const userSchema = new Schema<IUser>({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    accessToken:{type:String}

})