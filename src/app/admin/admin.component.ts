import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { AdminService } from './admin.service';
import { User } from '../models/user';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.css'],
	providers: [AdminService]
})
export class AdminComponent implements OnInit {

	constructor(private router: Router, private auth: AuthGuard) { }

	ngOnInit() {
		this.router.navigate(['admin/usuarios']);
	}

}
