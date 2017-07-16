import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { CoursesModule } from './courses/courses.module';
import { MessagesModule } from './messages/messages.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';

import { routes } from './app.routes';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		HomeComponent,
		SignupComponent,
		ProfileComponent,
	],
	imports: [
		SharedModule,
		RouterModule.forRoot(routes),
		AdminModule,
		CoursesModule,
		MessagesModule
	],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
