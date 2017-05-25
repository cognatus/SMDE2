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

@Component({
	selector: 'app-courses',
	templateUrl: './courses.component.html',
	styleUrls: ['./courses.component.css'],
	providers: [CoursesService, SubjectsService, GroupsService]
})
export class CoursesComponent implements OnInit {
	groupActive: boolean;
	course= new Course;
	courses: Course[];
	subjects: Subject[];
	groups: Group[];
	addedCourses: Course[] = [];

	constructor(private coursesService: CoursesService,private subjectsService: SubjectsService, private groupsService: GroupsService, private location: Location) {
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
					console.log(error.text());
				});
	}

	fetchSubjects(): void {
		this.subjectsService.getSubjects()
			.subscribe( subjects => {
					this.subjects = subjects;
				}, error => {
					console.log(error.text());
				});
	}

	fetchGroups(): void {
		this.groupsService.getGroups()
			.subscribe( groups => {
					this.groups = groups;
				}, error => {
					console.log(error.text());
				});
	}

	addCourses() {
		this.coursesService.addCourses(this.addedCourses)
			.subscribe( response => {
				location.reload()
			}, error => {
				console.log(error.text());
			});
	}

	addSubject(subject: Subject): void {
		this.addedCourses.push({ _id: undefined, subject: subject, group: undefined });
		this.groupActive = true;
	}

	addGroup(group: Group): void {
		this.addedCourses[this.addedCourses.length - 1].group = group;
		this.groupActive = false;
	}

	getRandomColor() {
		return {
			"background-color": colors[Math.floor(Math.random()*colors.length)]	
		};
	}

}
