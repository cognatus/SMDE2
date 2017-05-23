import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserCoursesService } from './user-courses.service';
import { Course } from '../models/course';
import { colors } from '../app.constants'; 

@Component({
  selector: 'app-user-courses',
  templateUrl: './user-courses.component.html',
  styleUrls: ['./user-courses.component.css'],
  providers: [UserCoursesService]
})
export class UserCoursesComponent implements OnInit {
	userId: string;
	courses: Course[];
	addedCourses: Course[];

	constructor(private router: Router, private auth: AuthGuard, private activatedRoute: ActivatedRoute, private userCoursesService: UserCoursesService) {
		this.activatedRoute.params.subscribe((params: Params) => {
        	this.userId = params['id'];
        });
	}

  	ngOnInit() {
		this.fetchSubjects();
	}

	fetchSubjects(): void {
		this.userCoursesService.getCourses(this.userId)
			.subscribe( courses => {
					this.courses = courses;
				}, error => {
					console.log(error.text());
				});
	}

	addCourses(): void {
		this.userCoursesService.addCourses(this.userId, this.addedCourses)
			.subscribe( courses => {
					this.addedCourses = courses
					location.reload();
				}, error => {
					console.log(error.text());
				});
	}

	getRandomColor() {
		return {
			"background-color": colors[Math.floor(Math.random()*colors.length)]	
		};
	}

}
