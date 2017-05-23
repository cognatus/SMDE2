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
			.subscribe( user => this.user = user,
				error => {
					console.log(error.text());
				});
	}

	updateUser(): void {
		this.userDetailService.updateUser(this.user)
			.subscribe( response => {
					location.reload();
				}, error => {
					console.log(error.text());
				});
	}

	deleteUser(): void {
		this.userDetailService.deleteUser(this.userId)
			.subscribe( response => {
					location.reload();
				}, error => {
					console.log(error.text());
				});
	}

	getRandomColor() {
		return {
			"background-color": colors[Math.floor(Math.random()*colors.length)]	
		};
	}

}
