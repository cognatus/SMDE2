import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../models/user';
import { trigger, state, style, animate, transition } from '@angular/core';

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

	getActive(parameter): boolean {
		let locationMenu = this.location.path().normalize();
		let active = locationMenu.split('/')[1];
		return parameter === active;
	}

}
