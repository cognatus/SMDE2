import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../_models/user';

import { toggleHeight } from '../_animations/toggleSize';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css'],
	animations: [toggleHeight]
})
export class MenuComponent implements OnInit {
	user: User;

	constructor(private router: Router, private auth: AuthGuard, private location: Location) {
		this.user = this.auth.getUser();
	}

	ngOnInit() {
	}

	logout(): void {
		this.auth.deleteUser();
		location.href = '/';
	}

}
