import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { CourseDetailService } from './course-detail.service';

import { User } from '../models/user';
import { Course } from '../models/course';
import { userTypes, getRandomColor, FormatDatePipe } from '../app.constants';

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

	constructor(private router: Router, private auth: AuthGuard, private activatedRoute: ActivatedRoute, private courseDetailService: CourseDetailService) {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.courseId = params['id'];
		});
	}

	ngOnInit() {
		this.fetchCourse();
	}

	fetchCourse(): void {
		this.courseDetailService.getCourse(this.courseId)
			.subscribe( course => {
				this.course = course;
				this.course.color = getRandomColor(this.course.name.charAt(0));
			}, error => {
				console.log(error);
			});
	}

	suscribeCourse(status: boolean): void {
		this.courseDetailService.suscribeCourse(status, this.courseId, this.auth.getUser(), '')
			.subscribe( response => {
				location.reload();
			}, error => {
				console.log(error);
			})
	}

	isSuscribed(): boolean {
		let flag = true;
		if ( this.course.user.id !== this.auth.getUser()._id ) {
			for ( let i = 0 ; i < this.course.members.length ; i++ ) {
				if ( this.course.members[i].user._id == this.auth.getUser()._id ) {
					flag = false;
					break;
				}
			}
		}
		return flag;
	}
}
