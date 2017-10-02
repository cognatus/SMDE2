import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CourseDetailService } from './course-detail.service';

import 'rxjs/add/operator/switchMap';

import { User } from '../../_models/user';
import { Course } from '../../_models/course';
import { Alert } from '../../_models/alert';

import { MEDIA_HOST, USER_TYPES, Colors } from '../../app.constants';

import { toggleSize } from '../../_animations/toggleSize';
import { slideReverse, slide } from '../../_animations/slide';

declare let $: any;
@Component({
	selector: 'app-course-detail',
	templateUrl: './course-detail.component.html',
	styleUrls: ['./course-detail.component.css'],
	animations: [toggleSize, slideReverse, slide]
})
export class CourseDetailComponent implements OnInit {
	mediaSrc = MEDIA_HOST;
	alert = new Alert();
	course = new Course();
	colors = new Colors();
	courseId: string = '';
	displayedList: number = 0; // O contenidos, 1 actividades, 2 miembros
	suscribeAction: boolean = true;

	constructor(private router: Router, 
		private auth: AuthService, 
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

	setConfirmation(event: Event, elem: string, obj?: any, status?: boolean) {
		event.preventDefault();
		let message: string = null;
		let cancel: boolean = true;
		this.alert = null;

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
				message = status ? 'Éxito' : 'Alerta';
				cancel = false;
				break;
		}

		this.alert = {
			title: 'Confirmación',
			body: message,
			action: elem,
			cancel: cancel
		}
		$('confirm-box').modal('show');
	}

	doConfirmation(status: boolean): void {
		switch (this.alert.action) {
			case 'deleteCourse':
				$('confirm-box').modal('hide');
				break;
			case 'suscribe':
				status ? this.suscribeCourse(true) : $('confirm-box').modal('hide');
				break;
			case 'unsuscribe':
				status? this.suscribeCourse(false): $('confirm-box').modal('hide');
				break;
			default:
				$('confirm-box').modal('hide');
				break;
		}
	}
}
