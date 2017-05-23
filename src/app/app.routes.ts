import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageConversationComponent } from './message-conversation/message-conversation.component';
import { AdminComponent } from './admin/admin.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserCoursesComponent } from './user-courses/user-courses.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { GroupsComponent } from './groups/groups.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', redirectTo: '' },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: SignupComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard],
    	children: [
    		{ path: '', redirectTo: 'admin/usuarios', pathMatch: 'full' },
    		{ path: 'usuarios', component: UsersComponent, canActivate: [AuthGuard] },
            { path: 'usuarios/:id', component: UserDetailComponent, canActivate: [AuthGuard],
                children: [
                    { path: 'subjects', component: UserCoursesComponent, canActivate: [AuthGuard] }
                ]
            },    
            { path: 'asignaturas', component: SubjectsComponent, canActivate: [AuthGuard] }
    	]
  	},
    { path: 'mensajes', component: MessagesComponent, canActivate: [AuthGuard],
        children: [
            { path: ':id', component: MessageConversationComponent }
        ]
    }
]