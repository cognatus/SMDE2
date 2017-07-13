import { Injectable, Input } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Router, CanActivate, CanDeactivate } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs';

import { ApiUrl } from '../app.constants';
import { User } from '../_models/user';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private router: Router, private http: Http) {
		/*console.log(localStorage.getItem('currentUser'));*/
	}

	canActivate() {
		// Check to see if a user has a valid JWT
		if ( this.isLogged() ) {
			// If they do, return true and allow the user to load the home component
			return true;
		} else {
			// If not, they redirect them to the login page
			this.router.navigate(['/login']);
			return false;
		}
	}

	isLogged(): boolean {
		let token = this.getToken();
		return token !== undefined && token !== null;
	}

	getUser(): User {
		let user = new User();
		if ( localStorage.getItem('currentUser') ) {
			user = JSON.parse(localStorage.getItem('currentUser')).user;
		}
		return user;
	}

	setUser(user: any): void { // user, token
		localStorage.setItem('currentUser', JSON.stringify(user));
	}

	getToken(): string {
		let token = undefined;
		if ( localStorage.getItem('currentUser') ) {
			token = JSON.parse(localStorage.getItem('currentUser')).token;
		}
		return token;
	}

	deleteUser(): void {
		localStorage.removeItem('currentUser');
	}

}