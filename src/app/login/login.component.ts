import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { ContentHeaders } from '../common/headers';
import { ApiUrl } from '../app.constants';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent {

	constructor(public router: Router, public http: Http) {}

	login(event, username, password) {
		event.preventDefault();
		let body = JSON.stringify({ username, password });
		this.http.post(ApiUrl + 'login', body, { headers: ContentHeaders })
			.subscribe(
				response => {
					localStorage.setItem('id_token', response.json().id_token);
					this.router.navigate(['home']);
				},
				error => {
					alert(error.text());
					console.log(error.text());
				}
			);
	}

}
