import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	token = localStorage.getItem('id_token');
	jwt: string;
	decodedJwt: string;

	constructor(private router: Router, private http: Http, private auth: AuthGuard) {
		this.jwt = this.token;
		this.decodedJwt = this.jwt;
	}

	ngOnInit() {
	}

}
