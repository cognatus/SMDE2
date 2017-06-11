import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthGuard } from '../auth/auth.guard';
import { CoursesService } from '../courses/courses.service';

import { Course } from '../models/course';
import { User } from '../models/user';
import { userTypes, replaceCharacters, getRandomColor, FormatDatePipe } from '../app.constants';

@Component({
	selector: 'app-courses',
	templateUrl: './courses.component.html',
	styleUrls: ['./courses.component.css'],
	providers: [CoursesService]
})
export class CoursesComponent implements OnInit {
	groupActive: boolean;
	user = new User;
	course= new Course;
	courses: Course[];
	tagsString: string;
	hiddenTags: string[] = [];
	displayingTags: string[] = [];
	selectedDisplayTag: number = -1;
	error: string = '';

	constructor(private coursesService: CoursesService, private location: Location, private router: Router, private auth: AuthGuard) {
		this.user = this.auth.getUser();
		this.course.tags = [];
	}

	ngOnInit() {
		this.fetchCourses();
		this.course.user = this.user;
	}

	fetchCourses(): void {
		this.coursesService.getCourses()
			.subscribe( courses => {
					this.courses = courses;
					for( let item in this.courses ) {
						this.courses[item].color = getRandomColor();
						for ( let sub in this.courses[item].tags ) {
							let tag = this.courses[item].tags[sub] 
							if ( this.hiddenTags.indexOf(tag) === -1 ) {
								this.hiddenTags.push(tag);
							}
						}
					}
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
				this.error = JSON.parse(error._body).message;
			});
	}

	addTag(event, tag: string): void {
		let tempTag = '';
		let tagsArray = [];
		let newTag = '';

		if ( tag !== undefined ) {
			newTag = tag;
		} else {
			if ( event.keyCode === 32 || event.keyCode === 13 || event.keyCode === 9 ) { // space, enter, tab
				event.preventDefault();
				tempTag = this.tagsString;
				if ( this.selectedDisplayTag > -1 ) {
					this.tagsString = this.displayingTags[this.selectedDisplayTag];
					tempTag = this.displayingTags[this.selectedDisplayTag];
				}
				tagsArray = tempTag.split(' ');
				newTag = tagsArray[tagsArray.length - 1];
			} else if ( event.keyCode === 38 || event.keyCode === 40 ) {
				if ( event.keyCode === 38 && this.selectedDisplayTag > 0 ) {
					this.selectedDisplayTag--;
				} else if ( event.keyCode == 40 && this.selectedDisplayTag < this.displayingTags.length - 1 ) {
					this.selectedDisplayTag++;
				}
			} else {
				this.selectedDisplayTag = -1;
			}
		}
		if ( newTag !== '' ) {
			if ( this.course.tags.indexOf(newTag) === -1 ) {
				this.course.tags.push(newTag);
			} 
			this.tagsString = '';
			this.selectedDisplayTag = -1;
		}
	}

	removeTag(tag: string): void {
		this.course.tags.splice(this.course.tags.indexOf(tag), 1);
	}

	findTagCoincidences(text: string, array: string[]): string[] {
		let coincidenceArray = [];
		text = replaceCharacters(text.toLowerCase());
		for ( let i in array ) {
			let itemText = replaceCharacters(array[i].toLowerCase());
			if ( itemText.indexOf( text ) > -1 ) {
				coincidenceArray.push(array[i]);
			}
		}
		return coincidenceArray;
	}

}
