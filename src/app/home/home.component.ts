import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	jwt: string;
	decodedJwt: string;
	response: string;
	api: string;

	constructor(private router: Router, private http: Http, private authHttp: AuthHttp) {
		this.jwt = localStorage.getItem('current_user');
		this.decodedJwt = this.jwt;
	}

	ngOnInit() {
		console.log(localStorage.getItem('current_user'));
	}

}
