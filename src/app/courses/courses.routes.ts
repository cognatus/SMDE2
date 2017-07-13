import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { CoursesComponent } from './courses.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';

export const routes: Routes = [
    { path: 'cursos', component: CoursesComponent, canActivate: [AuthGuard] },
    { path: 'cursos/:id', component: CourseDetailComponent, canActivate: [AuthGuard] },
]