import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

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
	
	constructor(private router: Router, private loginService: LoginService, private auth: AuthGuard) {}

	login(): void {
		this.loginService.loginUser(this.user)
	    	.subscribe( user => {
	    			localStorage.setItem('current_user', user._id);
	    			this.router.navigate(['home']);
				}, error => {
            		console.log(error.text());
            	});
	}

	ngOnInit() {
		console.log(localStorage.getItem('current_user'));
	}

}
