import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthGuard } from '../../auth/auth.guard';
import { UsersService } from './users.service';
import { User } from '../../_models/user';
import { Colors, USER_TYPES } from '../../app.constants';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.css'],
	providers: [UsersService]
})
export class UsersComponent implements OnInit {
	user= new User;
	users: User[];
	USER_TYPES: string[];

	constructor(private router: Router, private auth: AuthGuard, private usersService: UsersService) {
		this.USER_TYPES = USER_TYPES;
	}

	ngOnInit() {
		this.fetchUsers();
	}

	fetchUsers(): void {
		this.usersService.getUsers()
			.subscribe( users => this.users = users,
				error => {
					console.log(error);
				});
	}

	addUser(): void {
		this.usersService.addUser(this.user)
			.subscribe( response => {
					location.reload();
				}, error => {
					console.log(error);
				});
	}

}
