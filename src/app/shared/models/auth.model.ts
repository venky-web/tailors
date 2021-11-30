import * as moment from 'moment';

export interface AuthResponse {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

export class User {

    constructor(
        public email: string,
        public userId: string,
        public displayName: string,
        public photoUrl: string,
        public passwordHash: string,
        public idToken: string,
        public refreshToken: string,
        public expiresIn: Date | string,
    ) {}

    get token() {
        if(!this.expiresIn || moment(this.expiresIn, true).unix() >= moment().unix()) {
            return null;
        }
        return this.idToken;
    }
}
