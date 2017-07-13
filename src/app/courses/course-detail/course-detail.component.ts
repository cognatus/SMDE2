import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { CourseDetailService } from './course-detail.service';

import { User } from '../../_models/user';
import { Course } from '../../_models/course';
import { userTypes, Colors } from '../../app.constants';

@Component({
	selector: 'app-course-detail',
	templateUrl: './course-detail.component.html',
	styleUrls: ['./course-detail.component.css'],
	providers: [CourseDetailService]
})
export class CourseDetailComponent implements OnInit {
	courseId: string = '';
	course = new Course;
	courseMembers: User[];
	displayedList: number = 0; // O contenidos, 1 actividades, 2 miembros
	selectedGroup: any;
	colors= new Colors;

	constructor(private router: Router, private auth: AuthGuard, private activatedRoute: ActivatedRoute, private courseDetailService: CourseDetailService) {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.courseId = params['id'];
		});
	}

	ngOnInit() {
		this.fetchCourse();
		this.selectedGroup = undefined;
	}

	fetchCourse(): void {
		this.courseDetailService.getCourse(this.courseId)
			.subscribe( course => {
				this.course = course;
			}, error => {
				console.log(error);
			});
	}

	updateGroup(): void {
		this.courseDetailService.updateGroup(this.selectedGroup, this.course._id)
			.subscribe( response => {
				location.reload();
			}, error => {
				console.log(error);
			})
	}

	deleteGroup(): void {
		this.courseDetailService.deleteGroup(this.course._id, this.selectedGroup.id)
			.subscribe( response => {
				location.reload();
			}, error => {
				console.log(error);
			})
	}

	preventSubmit($event): void {
		event.preventDefault();
	}

	resetValues(): void {
		this.selectedGroup = undefined;
	}

	getGroupName(group: string): string {
		let name = '';
		for ( let item in this.course.groups ) {
			if ( this.course.groups[item]._id == group ) {
				name = this.course.groups[item].name;
				break;
			}
		}
		return name;
	}

	suscribeCourse(status: boolean): void {
		this.courseDetailService.suscribeCourse(status, this.courseId, this.auth.getUser(), '')
			.subscribe( response => {
				location.reload();
			}, error => {
				console.log(error);
			});
	}

	isSuscribed(): boolean {
		let flag = false;
		if ( this.course.user.id !== this.auth.getUser()._id ) {
			for ( let i = 0 ; i < this.course.members.length ; i++ ) {
				if ( this.course.members[i].user.id === this.auth.getUser()._id ) {
					flag = true;
					break;
				}
			}
		}
		return flag;
	}

	selectGroup(event, group: any): void {
		event.preventDefault();
		if ( group !== undefined ) {
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
	}

	getGroupMembers(group: string): User[] {
		let usersArray = [];
		if ( group !== undefined || group !== '' ) {
			for ( let item in this.course.members ) {
				if ( this.course.members[item].group === group ) {
					usersArray.push( this.course.members[item].user );
				}
			}
		} else {
			for ( let item in this.course.members ) {
				if ( this.course.members[item].group === undefined || this.course.members[item].group === '') {
					usersArray.push( this.course.members[item].user );
				}
			}
		}
		return usersArray;
	}

	addUserToGroup(user: User) {
		let check = this.selectedGroup.users.indexOf( user ); 
		if ( check > -1 ) {
			this.selectedGroup.users.splice(check, 1);	
		} else {
			this.selectedGroup.users.push(user);
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
}
