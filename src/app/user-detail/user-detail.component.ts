import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { UserDetailService } from './user-detail.service';
import { User } from '../models/user';
import { colors, userTypes } from '../app.constants';

@Component({
	selector: 'app-user-detail',
	templateUrl: './user-detail.component.html',
	styleUrls: ['./user-detail.component.css'],
	providers: [UserDetailService]
})
export class UserDetailComponent implements OnInit {
	userTypes: string[];
	userId: string;
	user= new User;
	formatedUserBirth: string;

	constructor(private router: Router, private auth: AuthGuard, private activatedRoute: ActivatedRoute, private userDetailService: UserDetailService) {
		this.userTypes = userTypes;
		this.activatedRoute.params.subscribe((params: Params) => {
        	this.userId = params['id'];
        });
	}

	ngOnInit() {
		this.fetchUser();
	}

	fetchUser(): void {
		this.userDetailService.getUser(this.userId)
			.subscribe( user => { 
					this.user = user;
					let userBirthDay = new Date(this.user.birthDay);
					this.formatedUserBirth = 
						((userBirthDay.getDate() + 1 < 10) ? '0' + (userBirthDay.getDate() + 1).toString() : (userBirthDay.getDate() + 1).toString()) + '/'
						+ ((userBirthDay.getMonth() + 1 < 10) ? '0' + (userBirthDay.getMonth() + 1).toString() : (userBirthDay.getMonth() + 1).toString()) + '/'
						+ (userBirthDay.getFullYear()).toString();
				}, error => {
					console.log(error);
				});
	}

	updateUser(): void {
		this.user.birthDay = new Date(this.formatedUserBirth);
		this.userDetailService.updateUser(this.user)
			.subscribe( response => {
					location.reload();
				}, error => {
					console.log(error);
				});
	}

	deleteUser(): void {
		this.userDetailService.deleteUser(this.userId)
			.subscribe( response => {
					location.reload();
				}, error => {
					console.log(error);
				});
	}

	getRandomColor() {
		return {
			"background-color": colors[Math.floor(Math.random()*colors.length)]	
		};
	}

}
