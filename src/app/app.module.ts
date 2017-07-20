import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { CoursesModule } from './courses/courses.module';
import { MessagesModule } from './messages/messages.module';
import { SettingsModule } from './settings/settings.module';

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
		BrowserModule,
		BrowserAnimationsModule,
		SharedModule,
		RouterModule.forRoot(routes),
	],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
