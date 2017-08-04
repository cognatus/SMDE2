import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../auth/auth.guard';

import { User } from '../_models/user'; 

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
	user: User;

	constructor(private auth: AuthGuard) {
		this.user = this.auth.getUser();
	}

	ngOnInit() {
	}

	doConfirmation(status: boolean) {
		console.log(status);
	}

}
