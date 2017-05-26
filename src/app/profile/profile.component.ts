import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserDetailService } from '../user-detail/user-detail.service';
import { User } from '../models/user';
import { colors, userTypes } from '../app.constants';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css'],
	providers: [UserDetailService]
})
export class ProfileComponent implements OnInit {
	userTypes: string[];
	userId: string;
	user = new User;
	formatedUserBirth: string;
	privateUser: boolean = true;

	constructor(private auth: AuthGuard, private location: Location, private router: Router, private activatedRoute: ActivatedRoute, private userDetailService: UserDetailService) {
		this.userTypes = userTypes;
		this.activatedRoute.params.subscribe((params: Params) => {
        	this.userId = params['id'];
        });
	}

	ngOnInit() {
		if ( this.userId !== undefined && this.userId !== '' ) {
			if ( this.userId === this.auth.getUser._id ) {
				this.user = this.auth.getUser;
			} else {
				this.fetchUser();
				this.privateUser = false;
			}
		} else {
			this.user = this.auth.getUser;
		}
		
		let userBirthDay = new Date(this.user.birthDay);
		this.formatedUserBirth = ''
			+ ((userBirthDay.getDate() + 1 < 10) ? '0' + (userBirthDay.getDate() + 1).toString() : (userBirthDay.getDate() + 1).toString()) + '/'
			+ ((userBirthDay.getMonth() + 1 < 10) ? '0' + (userBirthDay.getMonth() + 1).toString() : (userBirthDay.getMonth() + 1).toString()) + '/'
			+ (userBirthDay.getFullYear()).toString();
	}

	fetchUser(): void {
		this.userDetailService.getUser(this.userId)
			.subscribe( user => { 
					this.user = user;
				}, error => {
					console.log(error);
				});
	}

}
