import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { MessagesComponent } from './messages.component';
import { MessageConversationComponent } from './message-conversation/message-conversation.component';

export const routes: Routes = [
    { path: 'mensajes', component: MessagesComponent, canActivate: [AuthGuard],
        children: [
            { path: ':id', component: MessageConversationComponent }
        ]
    }
]