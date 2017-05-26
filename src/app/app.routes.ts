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
import { SubjectsComponent } from './subjects/subjects.component';
import { GroupsComponent } from './groups/groups.component';
import { CoursesComponent } from './courses/courses.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', redirectTo: '' },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: SignupComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard],
    	children: [
    		{ path: '', redirectTo: 'admin/usuarios', pathMatch: 'full' },
    		{ path: 'usuarios', component: UsersComponent, canActivate: [AuthGuard] },
            { path: 'usuarios/:id', component: UserDetailComponent, canActivate: [AuthGuard] },    
            { path: 'asignaturas', component: SubjectsComponent, canActivate: [AuthGuard] },
            { path: 'grupos', component: GroupsComponent, canActivate: [AuthGuard] },
            { path: 'cursos', component: CoursesComponent, canActivate: [AuthGuard] }
    	]
  	},
    { path: 'perfil', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'perfil/:id', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'mensajes', component: MessagesComponent, canActivate: [AuthGuard],
        children: [
            { path: ':id', component: MessageConversationComponent }
        ]
    }
]