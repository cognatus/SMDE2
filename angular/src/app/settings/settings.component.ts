import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

import { User } from '../_models/user'; 

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
	user: User;

	constructor(private auth: AuthService) {
		this.user = this.auth.getUser();
	}

	ngOnInit() {
	}

	doConfirmation(status: boolean) {
		console.log(status);
	}

}
