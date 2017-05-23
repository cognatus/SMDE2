import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { SubjectsService } from './subjects.service';
import { Subject } from '../models/subject'; 

@Component({
	selector: 'app-subjects',
	templateUrl: './subjects.component.html',
	styleUrls: ['./subjects.component.css'],
	providers: [SubjectsService]
})
export class SubjectsComponent implements OnInit {

	subjects: Subject[];
	subject = new Subject;

	constructor(private router: Router, private auth: AuthGuard, private subjectsService: SubjectsService) { }

	ngOnInit() {
		this.fetchSubjects();
	}

	fetchSubjects(): void {
		this.subjectsService.getSubjects()
			.subscribe( subjects => this.subjects = subjects,
				error => {
					console.log(error.text());
				});
	}

	addSubject(): void {
		this.subjectsService.addSubject(this.subject)
			.subscribe( subject => {
					this.subject = subject
					this.router.navigate(['admin/asignaturas']);
				}, error => {
					console.log(error.text());
				});
	}

}
