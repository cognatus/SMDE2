import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { SubjectsService } from './subjects.service';
import { Subject } from '../models/subject'; 

@Component({
	selector: 'app-admin',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.css'],
	providers: [SubjectsService]
})
export class SubjectsComponent implements OnInit {

	subjects: Subject[];
	subject = new Subject;

	constructor(private router: Router, private auth: AuthGuard, private usersService: SubjectsService) { }

	ngOnInit() {
		this.fetchSubjects();
	}

	fetchSubjects(): void {
		this.usersService.getSubjects()
			.subscribe( subjects => this.subjects = subjects,
				error => {
					console.log(error.text());
				});
	}

	addSubject():void {

	}

}
