import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UserDetailService } from './user-detail.service';
import 'rxjs/add/operator/switchMap';

import { User } from '../../_models/user';
import { USER_TYPES, Colors, formatedDate } from '../../app.constants';

@Component({
	selector: 'app-user-detail',
	templateUrl: './user-detail.component.html',
	styleUrls: ['./user-detail.component.css'],
	providers: [UserDetailService]
})
export class UserDetailComponent implements OnInit {
	USER_TYPES: string[];
	userId: string;
	user= new User;
	formatedUserBirth: string;

	constructor(private router: Router, private auth: AuthService, private activatedRoute: ActivatedRoute, private userDetailService: UserDetailService) {
		this.USER_TYPES = USER_TYPES;
		/*this.activatedRoute.params.subscribe((params: Params) => {
        	this.userId = params['id'];
        });*/
	}

	ngOnInit() {
		this.activatedRoute.paramMap
		    .switchMap((params: ParamMap) => 
		      		this.userDetailService.getUser( params.get('id') )
		      	)
		    .subscribe((user: User) => {
		    		this.user = user;
		    		this.formatedUserBirth = formatedDate(new Date(this.user.birthDay));
		    	}, (error: Error) => {
		    		console.log(error);
		    });
	}

	updateUser(): void {
		this.user.birthDay = new Date(this.formatedUserBirth);
		this.userDetailService.updateUser(this.user)
			.subscribe( response => {
					location.reload();
				}, error => {
					console.log(error);
				});
	}

	deleteUser(): void {
		this.userDetailService.deleteUser(this.userId)
			.subscribe( response => {
					location.reload();
				}, error => {
					console.log(error);
				});
	}

}
