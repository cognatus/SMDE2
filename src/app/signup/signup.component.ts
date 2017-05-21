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
	errorMessage: String;

	constructor(private router: Router, private signupService: SignupService) {}

	addUser(event): void {
		event.preventDefault();
		this.signupService.signup(this.user)
	    	.subscribe( user => {
	    			this.router.navigate(['login']);			   
				},
            	error => this.errorMessage = <any>error);
	}

}
