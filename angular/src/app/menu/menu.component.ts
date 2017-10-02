import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { User } from '../_models/user';

import { MEDIA_HOST } from '../app.constants';

import { toggleHeight } from '../_animations/toggleSize';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css'],
	animations: [toggleHeight]
})
export class MenuComponent implements OnInit {
	user: User;
	userSrc = '';

	constructor(private router: Router, private auth: AuthService, private location: Location) {
		this.user = this.auth.getUser();
		this.userSrc = MEDIA_HOST + this.user._id;
	}

	ngOnInit() {
	}

	logout(): void {
		this.auth.deleteUser();
		location.href = '/';
	}

}
