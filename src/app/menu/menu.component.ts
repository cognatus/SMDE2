import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../_models/user';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
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
