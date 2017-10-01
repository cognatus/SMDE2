import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { SharedModule } from '../shared/shared.module';

import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

const routes: Routes = [
    { path: '', component: AdminComponent, canActivate: [AuthGuard],
    	children: [
    		{ path: '', redirectTo: 'usuarios', pathMatch: 'full' },
    		{ path: 'usuarios', component: UsersComponent, canActivate: [AuthGuard] },
            { path: 'usuarios/:id', component: UserDetailComponent, canActivate: [AuthGuard] },
    	]
  	},
]

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
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
