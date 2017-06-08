import { Injectable, Input } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Router, CanActivate } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';

import { ApiUrl } from '../app.constants';
import { User } from '../models/user';

@Injectable()
export class AuthGuard implements CanActivate {
	getUser: User;
	token: string; jwt: string; decodedJwt: string;
	constructor(private router: Router, private http: Http) {
		this.getUser = JSON.parse(localStorage.getItem('user_profile'));
		this.token = localStorage.getItem('id_token');
		this.jwt = this.token;
		this.decodedJwt = this.jwt;
	}

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

	loggedIn(): boolean {
		let token = localStorage.getItem('id_token');
		return token !== undefined && token !== null;
	}

	updateUser(): void {
		this.http.get(ApiUrl + 'users/' + this.getUser._id)
			.subscribe( res => {
					localStorage.setItem('user_profile', JSON.stringify(res.json()))
				}, error => {
					console.log(error);
				});
	}

	deleteUser(): void {
		localStorage.removeItem('id_token');
		localStorage.removeItem('user_profile');
	}

}