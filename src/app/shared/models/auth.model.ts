import * as moment from 'moment';

export interface AuthResponse {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

export interface User {
    email?: string,
    userId?: string,
    displayName?: string,
    photoUrl?: string,
    passwordHash?: string,
    token?: string,
    refreshToken?: string,
    expiresIn?: Date | string,
}
