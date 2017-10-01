import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { SignupService } from './signup.service';
import { User } from '../_models/user';
import { USER_TYPES } from '../app.constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [SignupService]
})

export class SignupComponent {
	user = new User;
	USER_TYPES = USER_TYPES;

	constructor(private router: Router, private signupService: SignupService) {}

	signup(): void {
		this.signupService.addUser(this.user)
	    	.subscribe( user => {
	    			this.login();  
				}, error => {
					console.log(error);
            	});
	}

	login(): void {
		this.router.navigate(['login']);
	}

}
