import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from '../auth/auth.service';

import { SharedModule } from '../shared/shared.module';

import { MessagesComponent } from './messages.component';
import { MessageConversationComponent } from './message-conversation/message-conversation.component';
import { MessagesListComponent } from './messages-list/messages-list.component';

const routes: Routes = [
    { 
    	path: '', component: MessagesComponent, canActivate: [AuthService],
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
		MessageConversationComponent,
		MessagesListComponent
	],
	exports: [ MessagesComponent, MessagesListComponent, MessageConversationComponent ]
})
export class MessagesModule { }
