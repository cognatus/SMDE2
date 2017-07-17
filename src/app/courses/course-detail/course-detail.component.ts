import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { CourseDetailService } from './course-detail.service';

import 'rxjs/add/operator/switchMap';

import { User } from '../../_models/user';
import { Course } from '../../_models/course';
import { userTypes, Colors } from '../../app.constants';

import { toggleSize } from '../../_animations/toggleSize';
import { sliceReverse, slice } from '../../_animations/slice';

@Component({
	selector: 'app-course-detail',
	templateUrl: './course-detail.component.html',
	styleUrls: ['./course-detail.component.css'],
	providers: [CourseDetailService],
	animations: [toggleSize, sliceReverse, slice]
})
export class CourseDetailComponent implements OnInit {
	course = new Course;
	colors = new Colors;
	courseId: string = '';
	courseMembers: User[];
	displayedList: number = 0; // O contenidos, 1 actividades, 2 miembros
	selectedGroup: any;
	suscribeAction: boolean = true;
	confirmationStatus: any = {
		message: null,
		action: null
	};

	constructor(private router: Router, 
		private auth: AuthGuard, 
		private activatedRoute: ActivatedRoute, 
		private courseDetailService: CourseDetailService) {
	}

	ngOnInit() {
		this.activatedRoute.paramMap.switchMap((params: Params) => 
			this.courseDetailService.getCourse(params.get('id')))
				.subscribe( course => {
					this.course = course;
				});
		this.resetValues();
	}

	fetchCourse(): void {
		this.courseDetailService.getCourse(this.course._id)
			.subscribe( course => {
				this.course = course;
			}, error => {
				console.log(error);
			});
	}

	updateGroup(): void {
		this.courseDetailService.updateGroup(this.selectedGroup, this.course._id)
			.subscribe( response => {
				this.fetchCourse();
				this.resetValues();
			}, error => {
				console.log(error);
			})
	}

	deleteGroup(): void {
		this.courseDetailService.deleteGroup(this.course._id, this.selectedGroup.id)
			.subscribe( response => {
				this.fetchCourse();
				this.resetValues();
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
		this.courseDetailService.suscribeCourse(status, this.course._id, this.auth.getUser(), '')
			.subscribe( response => {
				this.fetchCourse();
			}, error => {
				console.log(error);
			});
	}

	isSuscribed(): boolean {
		let flag = false;
		if ( this.course.user.id !== this.auth.getUser()._id ) {
			for ( let i = 0 ; i < this.course.members.length ; i++ ) {
				if ( this.course.members[i].user._id === this.auth.getUser()._id ) {
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

	setConfirmation(event: Event, elem: string) {
		event.preventDefault();
		let message: string = null;

		switch (elem) {
			case 'deleteCourse':
				message = 'Estas a punto de eliminar el curso. ¿Estas seguro?';
				break;
			case 'deleteGroup':
				message = 'Estas a punto de eliminar este grupo. ¿Estas seguro?';
				break;
			case 'suscribe':
				message = 'Al inscribirte comenzaras a recibir norificaciones acerca de la actividad en el curso.';
				break;
			case 'unsuscribe':
				message = 'Estas a punto de cancelar tu inscripción a este curso. ¿Estas seguro?';
				break;
			default:
				message = null;
				break;
		}

		this.confirmationStatus = {
			message: message,
			action: elem
		}
	}

	doConfirmation(status: boolean): void {
		if ( status ) {
			switch (this.confirmationStatus.action) {
				case 'deleteCourse':
					// code...
					break;
				case 'deleteGroup':
					this.deleteGroup();
					break;
				case 'suscribe':
					this.suscribeCourse(true);
					break;
				case 'unsuscribe':
					this.suscribeCourse(false);
					break;
				default:
					// code...
					break;
			}
			this.confirmationStatus = {
				message: null,
				action: null
			};
		} else {
			this.confirmationStatus = {
				message: null,
				action: null
			};
		}
	}
}
