import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthGuard } from '../auth/auth.guard';
import { SubjectsService } from './subjects.service';
import { Subject } from '../models/subject'; 
import { colors } from '../app.constants'; 

@Component({
	selector: 'app-subjects',
	templateUrl: './subjects.component.html',
	styleUrls: ['./subjects.component.css'],
	providers: [SubjectsService]
})
export class SubjectsComponent implements OnInit {
	subjects: Subject[];
	subject = new Subject;
	error: string = '';

	constructor(private router: Router, private auth: AuthGuard, private subjectsService: SubjectsService, private location: Location) {}

	ngOnInit() {
		this.fetchSubjects();
	}

	fetchSubjects(): void {
		this.subjectsService.getSubjects()
			.subscribe( subjects => {
					this.subjects = subjects;
				}, error => {
					console.log(error);
				});
	}

	addSubject(): void {
		this.subjectsService.addSubject(this.subject)
			.subscribe( subject => {
					location.reload();
				}, error => {
					console.log(JSON.parse(error._body).message);
					this.error = JSON.parse(error._body).message;
				});
	}

	getRandomColor() {
		return {
			"background-color": colors[Math.floor(Math.random()*colors.length)]	
		};
	}

}
