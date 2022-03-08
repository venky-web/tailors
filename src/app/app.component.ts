import { Component } from '@angular/core';
import { Storage } from '@capacitor/storage';

import { UserService } from './shared/services/user.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent {

    constructor(
        private userService: UserService,
    ) {
        this.loadUserData();
        this.loadBusinessData();
        this.loadToken();
    }

    async loadUserData() {
        const userDetails = await Storage.get({key: 'userDetails'});
        if (userDetails && userDetails.value) {
            this.userService.setUser(JSON.parse(userDetails.value));
        }
    }

    async loadBusinessData() {
        const bDetails = await Storage.get({key: 'bDetails'});
        if (bDetails && bDetails.value) {
            this.userService.setBusiness(JSON.parse(bDetails.value));
        }
    }

    async loadToken() {
        const token = await Storage.get({key: 'token'});
        if (token && token.value) {
            this.userService.setAccessToken(token.value);
        }
    }

}
