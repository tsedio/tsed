export interface IUser {
    _id?: string;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    phone?: string;
    address?: string;
}