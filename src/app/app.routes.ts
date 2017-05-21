import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'home', redirectTo: '' },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: SignupComponent },
    { path: '**', redirectTo: '' }
]