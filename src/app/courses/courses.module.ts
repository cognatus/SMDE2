import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { CourseDetailService } from './course-detail/course-detail.service';

import { SharedModule } from '../shared/shared.module';

import { CoursesComponent } from './courses.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { GroupsComponent } from './groups/groups.component';

const routes: Routes = [
    { 
    	path: '', 
    	component: CoursesComponent, 
    	canActivate: [AuthGuard],
    }, { 
    	path: ':id', 
    	component: CourseDetailComponent, 
    	canActivate: [AuthGuard] 
    }
]

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		RouterModule.forChild(routes)
	],
	declarations: [
		CoursesComponent,
		CourseDetailComponent,
		GroupsComponent
	],
	providers: [CourseDetailService]
})
export class CoursesModule { }
