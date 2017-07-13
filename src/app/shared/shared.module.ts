import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AuthGuard } from '../auth/auth.guard';
import { MenuComponent } from '../menu/menu.component';
import { NotificationsComponent } from '../notifications/notifications.component';

import { FocusedDirective } from '../_directives/focused.directive';
import { FormatDatePipe } from '../_pipes/formatdate';

@NgModule({
	imports: [
		CommonModule,
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule
	],
	declarations: [
		FocusedDirective,
		FormatDatePipe,
		MenuComponent,
		NotificationsComponent
	],
	exports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		FocusedDirective, 
		FormatDatePipe,
		MenuComponent,
		NotificationsComponent
	],
	providers: [ AuthGuard ]
})
export class SharedModule { }
