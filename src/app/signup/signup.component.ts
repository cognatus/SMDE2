import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { SignupService } from './signup.service';
import { User } from '../models/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [SignupService]
})

export class SignupComponent {
	user = new User;
	errorMessage: string;

	constructor(private router: Router, private signupService: SignupService) {}

	signup(): void {
		event.preventDefault();
		console.log(this.user);
		this.signupService.addUser(this.user)
	    	.subscribe( user => {
	    			this.login();		   
				},
            	error => this.errorMessage = <any>error);
	}

	login(): void {
		this.router.navigate(['login']);
	}

}
