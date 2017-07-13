import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

import { routes } from './admin.routes'

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forRoot(routes),
		SharedModule
	],
	declarations: [
		AdminComponent,
		UsersComponent,
		UserDetailComponent,
	],
	exports: [ AdminComponent, UsersComponent, UserDetailComponent ],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AdminModule { }
