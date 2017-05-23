import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';
import { User } from '../models/user'; 

@Component({
	selector: 'app-admin',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.css'],
	providers: [UsersService]
})
export class UsersComponent implements OnInit {

	users: User[];
	userTypes: string[];

	constructor(private router: Router, private auth: AuthGuard, private usersService: UsersService) { }

	ngOnInit() {
		this.userTypes = ['Administrador', 'Alumno', 'Profesor'];
		this.fetchUsers();
	}

	fetchUsers(): void {
		this.usersService.getUsers()
			.subscribe( users => this.users = users,
				error => {
					console.log(error.text());
				});
	}

}
