export interface UserData{
    username:string;
    email:string;
    token:string;
    bio:string;
    image?:string;
}
export interface IUser{
    user:UserData
}