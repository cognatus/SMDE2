import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private router: Router) {}

	canActivate() {
		// Check to see if a user has a valid JWT
		if (this.loggedIn()) {
			// If they do, return true and allow the user to load the home component
			return true;
		} else {
			// If not, they redirect them to the login page
			this.router.navigate(['/login']);
			return false;
		}
	}

	loggedIn() {
		return localStorage.getItem('current_user') !== undefined && localStorage.getItem('current_user') !== null;
	}
}