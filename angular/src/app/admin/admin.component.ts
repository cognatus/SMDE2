import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AuthGuard } from '../auth/auth.guard';
import { AdminService } from './admin.service';
import { User } from '../_models/user';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.css'],
	providers: [AdminService]
})
export class AdminComponent implements OnInit {

	location: Location;

	constructor(private router: Router, private auth: AuthGuard, location: Location) {
		this.location = location;
	}

	ngOnInit() {
		if ( this.auth.getUser().privilege !== 0 ) {
			location.href = '/';
		} else {
			if ( this.location.path() == '/admin' ) {
				this.router.navigate(['admin/usuarios']);
			} else if (this.location.path() == '/admin/asignaturas' ) {
				this.router.navigate(['admin/asignaturas']);
			} else if (this.location.path() == '/admin/grupos' ) {
				this.router.navigate(['admin/grupos']);
			} else if (this.location.path() == '/admin/cursos' ) {
				this.router.navigate(['admin/cursos']);
			}
		}
	}

}
