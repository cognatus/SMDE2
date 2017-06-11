import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { CourseDetailService } from './course-detail.service';

import { User } from '../models/user';
import { Course } from '../models/course';
import { userTypes, getRandomColor } from '../app.constants';

@Component({
	selector: 'app-course-detail',
	templateUrl: './course-detail.component.html',
	styleUrls: ['./course-detail.component.css'],
	providers: [CourseDetailService]
})
export class CourseDetailComponent implements OnInit {
	courseId: string = '';
	course = new Course;

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
			}, error => {
				console.log(error);
			});
	}

	suscribeCourse(): void {
		this.courseDetailService.suscribeCourse(this.courseId, this.auth.getUser())
			.subscribe( response => {
				location.reload();
			}, error => {
				console.log(error);
			})
	}

}
