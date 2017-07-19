import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AuthGuard } from '../auth/auth.guard';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { MenuComponent } from '../menu/menu.component';
import { NotificationsComponent } from '../notifications/notifications.component';

import { FocusedDirective } from '../_directives/focused.directive';
import { FormatDatePipe } from '../_pipes/formatdate';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule
	],
	declarations: [
		FocusedDirective,
		FormatDatePipe,
		ConfirmationComponent,
		MenuComponent,
		NotificationsComponent
	],
	exports: [
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		FocusedDirective,
		FormatDatePipe,
		ConfirmationComponent,
		MenuComponent,
		NotificationsComponent
	],
	providers: [ AuthGuard ]
})
export class SharedModule { }
