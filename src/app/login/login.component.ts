import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { LoginService } from './login.service';
import { User } from '../models/user';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
	providers: [LoginService]
})
export class LoginComponent implements OnInit{
	user = new User;
	error: string = '';
	
	constructor(private router: Router, private loginService: LoginService, private location: Location) {}

	login(): void {
		this.loginService.loginUser(this.user)
	    	.subscribe( user => {
	    			location.href = '/home';
				}, error => {
            		console.log(error);
            		this.error = 'Usuario o contraseña incorrectos';
            	});
	}

	ngOnInit() {
	}

}
