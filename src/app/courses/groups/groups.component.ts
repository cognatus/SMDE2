import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthGuard } from '../../auth/auth.guard';

import { CourseDetailComponent } from '../course-detail/course-detail.component';
import { CourseDetailService } from '../course-detail/course-detail.service';

import { Group } from '../../_models/group';
import { User } from '../../_models/user';
import { Colors } from '../../app.constants';

import { toggleSize } from '../../_animations/toggleSize';
import { slideReverse, slide } from '../../_animations/slide';
import { fade } from '../../_animations/fade';

@Component({
	selector: 'app-groups',
	templateUrl: './groups.component.html',
	styleUrls: ['./groups.component.css'],
	animations: [toggleSize, slide, slideReverse, fade]
})
export class GroupsComponent implements OnInit {

	@Input() course: string;
	@Input() groups: Group[];
	@Input() members: any[];
	@Output() onUpdate = new EventEmitter<boolean>();
	colors = new Colors();
	selectedGroup: any;
	alertMessage;
	usersNoGroup: any;
	originalSelectedGroup: any = {
		name: null,
		users: null,
	};

	constructor(private courseDetailService: CourseDetailService, 
		private auth: AuthGuard) {}

	ngOnInit() {
		this.usersNoGroup = this.getGroupMembers();
	}

	resetValues(): void {
		this.selectedGroup = undefined;
		this.originalSelectedGroup = {
			id: null,
			name: null,
			users: null,
			isNew: null
		};
	}

	updateGroup(): void {
		this.courseDetailService.updateGroup(this.selectedGroup, this.course)
			.subscribe( response => {
				this.onUpdate.emit(true);
				this.resetValues();
			}, error => {
				console.log(error);
			})
	}

	deleteGroup(): void {
		this.courseDetailService.deleteGroup(this.course, this.selectedGroup.id)
			.subscribe( response => {
				this.onUpdate.emit(true);
				this.resetValues();
			}, error => {
				console.log(error);
			})
	}

	selectGroup(event, group?: any): void {
		event.preventDefault();
		if ( group ) {
			this.selectedGroup = {
				id: group._id,
				name: group.name,
				users: this.getGroupMembers(group._id),
				isNew: false
			};
		} else {
			this.selectedGroup = {
				id: 'newgroupid',
				name: '',
				users: [],
				isNew: true
			};
		}

		this.originalSelectedGroup.users = group ? this.getGroupMembers(group._id) : [];
		this.originalSelectedGroup.name = group ? group.name : '';
	}

	groupNotChanged() {
		let checkUsersChange = false;

		for ( let i = 0; i < this.originalSelectedGroup.users.length; i++ ) {
			if ( this.selectedGroup.users.indexOf(this.originalSelectedGroup.users[i]) < 0 ) {
				checkUsersChange = true;
			}
		}

		for ( let i = 0; i < this.selectedGroup.users.length; i++ ) {
			if ( this.originalSelectedGroup.users.indexOf(this.selectedGroup.users[i]) < 0 ) {
				checkUsersChange = true;
			}
		}

		return this.originalSelectedGroup.name === this.selectedGroup.name && 
			!checkUsersChange;
	}

	getGroupMembers(group?: string): User[] {
		let usersArray = [];
		if ( group !== undefined && group !== '' ) {
			for ( let item in this.members ) {
				if ( this.members[item].group === group ) {
					usersArray.push( this.members[item].user );
				}
			}
		} else {
			for ( let item in this.members ) {
				if ( this.members[item].group === undefined || this.members[item].group === '') {
					usersArray.push( this.members[item].user );
				}
			}
		}
		return usersArray;
	}

	addUserToGroup(user: User) {
		let check = this.selectedGroup.users.indexOf( user ); 
		if ( check > -1 ) {
			this.selectedGroup.users.splice(check, 1);
			this.usersNoGroup.push(user);
		} else {
			this.selectedGroup.users.push(user);
			this.usersNoGroup.splice(this.usersNoGroup.indexOf(user), 1);
		}
	}

	isInGroup(id: string): boolean {
		let flag = false;
		for( let item in this.selectedGroup.users ) { 
			if ( this.selectedGroup.users[item].id === id ) {
				flag = true;
				break;
			}
		}
		return flag;
	}

	setConfirmation(event: Event) {
		event.preventDefault();
		this.alertMessage = 'Estas a punto de eliminar este grupo. ¿Estas seguro?';
	}

	doConfirmation(status: boolean): void {
		if (status) {
			this.deleteGroup();
			this.onUpdate.emit(true);
		}
		this.alertMessage = null;
	}

}
