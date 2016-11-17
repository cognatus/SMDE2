import { Component, OnInit } from '@angular/core';
import { Configuration } from './../../app.constants';
import { User } from './../../models/user';
import { UsersService } from './users.service';

@Component({
	moduleId: module.id,
    selector: 'main-page',
    templateUrl: 'mainpage.component.html',
    styleUrls: ['mainpage.component.css'],
    providers: [UsersService]
})
export class MainPageComponent implements OnInit{
	users: User[];

	constructor(private config: Configuration, private usersService: UsersService){}

	ngOnInit() {
		this.usersService.getUsers()
      		.subscribe(users => this.users = users);
	}

}