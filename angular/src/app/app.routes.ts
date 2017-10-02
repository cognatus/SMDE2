import { Routes } from '@angular/router';
import { AuthService } from './auth/auth.service';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { 
    	path: '', 
    	component: HomeComponent 
    }, { 
    	path: 'home', 
    	redirectTo: '' },
    { 
    	path: 'login', 
    	component: LoginComponent 
    }, { 
    	path: 'registro', 
    	component: SignupComponent 
    }, { 
    	path: 'perfil', 
    	component: ProfileComponent, 
    	canActivate: [AuthService] 
    }, { 
    	path: 'perfil/:id', 
    	component: ProfileComponent 
    }, { 
        path: 'admin',
        loadChildren: 'app/admin/admin.module#AdminModule' 
    }, { 
    	path: 'cursos', 
    	loadChildren: 'app/courses/courses.module#CoursesModule' 
    }, { 
        path: 'mensajes', 
        loadChildren: 'app/messages/messages.module#MessagesModule' 
    }, { 
        path: 'ajustes', 
        loadChildren: 'app/settings/settings.module#SettingsModule' 
    }
]