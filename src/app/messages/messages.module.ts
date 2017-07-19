import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { SharedModule } from '../shared/shared.module';

import { MessagesComponent } from './messages.component';
import { MessageConversationComponent } from './message-conversation/message-conversation.component';

const routes: Routes = [
    { 
    	path: 'mensajes', component: MessagesComponent, canActivate: [AuthGuard],
        children: [
            { 
            	path: ':id', component: MessageConversationComponent 
            }
        ]
    }
]

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		SharedModule
	],
	declarations: [
		MessagesComponent,
		MessageConversationComponent
	],
	exports: [ MessagesComponent, MessageConversationComponent ]
})
export class MessagesModule { }
