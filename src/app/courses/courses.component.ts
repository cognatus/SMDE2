import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthGuard } from '../auth/auth.guard';
import { CoursesService } from '../courses/courses.service';
import { SubjectsService } from '../subjects/subjects.service';
import { GroupsService } from '../groups/groups.service';
import { Subject } from '../models/subject';
import { Group } from '../models/group';
import { Course } from '../models/course';
import { colors } from '../app.constants';
import {
	trigger,
	state,
	style,
	animate,
	transition
} from '@angular/core';

@Component({
	selector: 'app-courses',
	templateUrl: './courses.component.html',
	styleUrls: ['./courses.component.css'],
	providers: [CoursesService, SubjectsService, GroupsService],
	animations: [
		trigger('scrollPopup', [
			transition('* => active', [
				animate(100, style({ scrollTop: '0' }))
			])
		])
	]
})
export class CoursesComponent implements OnInit {
	groupActive: boolean;
	course= new Course;
	courses: Course[];
	subjects: Subject[];
	groups: Group[];
	addedCourses: Course[] = [];
	error: string = '';

	constructor(private coursesService: CoursesService,private subjectsService: SubjectsService, private groupsService: GroupsService, private location: Location, private router: Router) {
		this.groupActive = false;
	}

	ngOnInit() {
		this.fetchCourses();
	}

	fetchCourses(): void {
		this.coursesService.getCourses()
			.subscribe( courses => {
					this.courses = courses;
				}, error => {
					console.log(error);
				});
	}

	fetchSubjects(): void {
		this.subjectsService.getSubjects()
			.subscribe( subjects => {
					this.subjects = subjects;
				}, error => {
					console.log(error);
				});
	}

	fetchGroups(): void {
		this.groupsService.getGroups()
			.subscribe( groups => {
					this.groups = groups;
				}, error => {
					console.log(error);
				});
	}

	addCourses(event) {
		event.preventDefault();
		this.coursesService.addCourses(this.addedCourses)
			.subscribe( response => {
				location.reload();
			}, error => {
				console.log(error);
				console.log(JSON.parse(error._body).message);
				this.error = JSON.parse(error._body).message;
			});
	}

	addSubject(subject: Subject): void {
		this.addedCourses.push({ _id: undefined, subject: subject, group: undefined });
		this.groupActive = true;
	}

	addGroup(group: Group): void {
		let flagAdd = true;
		for ( let i = 0 ; i < this.courses.length ; i++ ) {
			if ( ( this.addedCourses[this.addedCourses.length - 1].subject.key === this.courses[i].subject.key ) && ( group.key === this.courses[i].group.key ) ) {
				flagAdd = false;
				break;
			}
		}

		if ( !flagAdd ) {
			this.error = 'Selecciona otro grupo. Ya existe un curso con la asignatura y el grupo seleccionado';
		} else {
			this.addedCourses[this.addedCourses.length - 1].group = group;
			this.error = '';
			this.groupActive = false;
		}
	}

	deleteCourse(course: Course) {
		let index = this.addedCourses.indexOf(course);
		if ( index > -1 ) {
			this.addedCourses.splice(index, 1);
		}
	}

	getRandomColor() {
		return {
			"background-color": colors[Math.floor(Math.random()*colors.length)]	
		};
	}

}
