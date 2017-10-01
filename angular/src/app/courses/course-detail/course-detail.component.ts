import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { CourseDetailService } from './course-detail.service';

import 'rxjs/add/operator/switchMap';

import { User } from '../../_models/user';
import { Course } from '../../_models/course';
import { USER_TYPES, Colors } from '../../app.constants';

import { toggleSize } from '../../_animations/toggleSize';
import { slideReverse, slide } from '../../_animations/slide';

@Component({
	selector: 'app-course-detail',
	templateUrl: './course-detail.component.html',
	styleUrls: ['./course-detail.component.css'],
	animations: [toggleSize, slideReverse, slide]
})
export class CourseDetailComponent implements OnInit {
	course = new Course;
	colors = new Colors;
	courseId: string = '';
	displayedList: number = 0; // O contenidos, 1 actividades, 2 miembros
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
	}

	fetchCourse(): void {
		this.courseDetailService.getCourse(this.course._id)
			.subscribe( course => {
				this.course = course;
			}, error => {
				console.log(error);
			});
	}

	preventSubmit($event): void {
		event.preventDefault();
	}

	getMemberGroup(group: string): string {
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

	setConfirmation(event: Event, elem: string) {
		event.preventDefault();
		let message: string = null;

		switch (elem) {
			case 'deleteCourse':
				message = 'Estas a punto de eliminar el curso. ¿Estas seguro?';
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
		}
		this.confirmationStatus = {
			message: null,
			action: null
		};
	}
}
