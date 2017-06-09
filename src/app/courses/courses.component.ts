import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthGuard } from '../auth/auth.guard';
import { CoursesService } from '../courses/courses.service';

import { Course } from '../models/course';
import { User } from '../models/user';
import { colors } from '../app.constants';

@Component({
	selector: 'app-courses',
	templateUrl: './courses.component.html',
	styleUrls: ['./courses.component.css'],
	providers: [CoursesService],
})
export class CoursesComponent implements OnInit {
	groupActive: boolean;
	user = new User;
	course= new Course;
	courses: Course[];
	error: string = '';

	constructor(private coursesService: CoursesService, private location: Location, private router: Router, private auth: AuthGuard) {
		this.user = this.auth.getUser();
	}

	ngOnInit() {
		this.fetchCourses();
		this.course.user = this.user;
		for( let item in this.courses ) {
			this.courses[item].color = this.getRandomColor();
		}
	}

	fetchCourses(): void {
		this.coursesService.getCourses()
			.subscribe( courses => {
					this.courses = courses;
				}, error => {
					console.log(error);
				});
	}

	addCourse(event): void {
		event.preventDefault();
		this.coursesService.addCourse(this.course)
			.subscribe( response => {
				location.reload();
			}, error => {
				console.log(error);
				console.log(JSON.parse(error._body).message);
				this.error = JSON.parse(error._body).message;
			});
	}

	deleteCourse(course: Course): void {
		
	}

	getRandomColor() {
		return colors[Math.floor(Math.random()*colors.length)];
	}

}
