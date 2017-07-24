import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthGuard } from '../auth/auth.guard';

import { LoginService } from './login.service';
import { User } from '../_models/user';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
	providers: [LoginService]
})
export class LoginComponent implements OnInit{
	user: any = { mail: '', password: '' };
	error: string = '';
	
	constructor(private router: Router, private loginService: LoginService, private location: Location, private auth: AuthGuard) {}

	login(): void {
		this.loginService.loginUser(this.user)
	    	.subscribe( response => {
		    		this.auth.setUser(response);
		    		location.reload();
				}, error => {
            		this.error = error.message;
            	});
	}

	ngOnInit() {
		if ( this.auth.isLogged() ) {
			this.router.navigate(['/home']);
		}
	}

}
