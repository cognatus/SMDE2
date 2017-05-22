import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../models/user';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

	user: User;

	constructor(private router: Router, private auth: AuthGuard) { }

	ngOnInit() {
		this.user = JSON.parse(localStorage.getItem('user_profile'));
	}

	logout(): void {
		localStorage.removeItem('id_token');
		localStorage.removeItem('user_profile');
		this.router.navigate(['/login']);
	}

}
