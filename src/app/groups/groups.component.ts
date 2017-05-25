import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthGuard } from '../auth/auth.guard';
import { GroupsService } from './groups.service';
import { Group } from '../models/group'; 
import { colors } from '../app.constants'; 

@Component({
	selector: 'app-groups',
	templateUrl: './groups.component.html',
	styleUrls: ['./groups.component.css'],
	providers: [GroupsService]
})
export class GroupsComponent implements OnInit {
	groups: Group[];
	group = new Group;
	error: string = '';

	constructor(private router: Router, private auth: AuthGuard, private groupsService: GroupsService) {}

	ngOnInit() {
		this.fetchGroups();
	}

	fetchGroups(): void {
		this.groupsService.getGroups()
			.subscribe( groups => {
					this.groups = groups;
				}, error => {
					console.log(error);
				});
	}

	addGroup(): void {
		this.groupsService.addGroup(this.group)
			.subscribe( group => {
					this.group = group
					location.reload();
				}, error => {
					console.log(JSON.parse(error._body).message);
					this.error = JSON.parse(error._body).message;
				});
	}

	getRandomColor() {
		return {
			"background-color": colors[Math.floor(Math.random()*colors.length)]	
		};
	}

}
