import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { MessagesComponent } from './messages.component';
import { MessageConversationComponent } from './message-conversation/message-conversation.component';

import { routes } from './messages.routes'

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forRoot(routes),
		SharedModule
	],
	declarations: [
		MessagesComponent,
		MessageConversationComponent
	],
	exports: [ MessagesComponent, MessageConversationComponent ],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class MessagesModule { }
