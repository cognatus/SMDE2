import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from '../auth/auth.service';

import { CourseDetailService } from './course-detail/course-detail.service';

import { SharedModule } from '../shared/shared.module';

import { CoursesComponent } from './courses.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { GroupsComponent } from './groups/groups.component';
import { ContentsComponent } from './contents/contents.component';

const routes: Routes = [
    { 
    	path: '', 
    	component: CoursesComponent, 
    	canActivate: [AuthService],
    }, { 
    	path: ':id', 
    	component: CourseDetailComponent, 
    	canActivate: [AuthService] 
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
		GroupsComponent,
		ContentsComponent
	],
	providers: [CourseDetailService]
})
export class CoursesModule { }
