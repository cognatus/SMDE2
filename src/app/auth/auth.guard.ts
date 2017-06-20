import { Injectable, Input } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Router, CanActivate } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs';

import { ApiUrl } from '../app.constants';
import { User } from '../models/user';

@Injectable()
export class AuthGuard implements CanActivate {
	token: string; jwt: string; decodedJwt: string;
	authUser: User;

	constructor(private router: Router, private http: Http) {
		if ( localStorage.getItem('currentUser') !== null ) {
			this.authUser = JSON.parse(localStorage.getItem('currentUser')).user;
			this.token = JSON.parse(localStorage.getItem('currentUser')).token;
		}
		this.jwt = this.token;
		this.decodedJwt = this.jwt;
	}

	canActivate() {
		// Check to see if a user has a valid JWT
		if ( this.loggedIn() ) {
			// If they do, return true and allow the user to load the home component
			return true;
		} else {
			// If not, they redirect them to the login page
			this.router.navigate(['/login']);
			return false;
		}
	}

	loggedIn(): boolean {
		let token = this.token;
		return token !== undefined && token !== null;
	}

	getUser(): User {
		return this.authUser;
	}

	updateUser() {
		this.http.get(ApiUrl + 'users/' + this.getUser()._id)
			.subscribe( response => {
					let oldToken = JSON.parse(localStorage.getItem('currentUser'));
					oldToken.user = response;
					localStorage.setItem('currentUser', JSON.stringify(oldToken));
				}, error => {
					console.log(error);
				});
	}

	deleteUser(): void {
		this.token = null;
		localStorage.removeItem('currentUser');
	}

}