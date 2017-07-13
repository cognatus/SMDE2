import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { FocusedDirective } from '../_directives/focused.directive';
import { FormatDatePipe } from '../_pipes/formatdate';

import { CoursesComponent } from './courses.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { GroupsComponent } from './groups/groups.component';

import { routes } from './courses.routes'

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forRoot(routes),
		SharedModule
	],
	declarations: [
		CoursesComponent,
		CourseDetailComponent,
		GroupsComponent
	],
	exports: [ CoursesComponent, CourseDetailComponent, GroupsComponent ],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CoursesModule { }
