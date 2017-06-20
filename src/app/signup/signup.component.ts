import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { SignupService } from './signup.service';
import { User } from '../models/user';
import { userTypes } from '../app.constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [SignupService]
})

export class SignupComponent {
	user = new User;
	userTypes = userTypes;

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
