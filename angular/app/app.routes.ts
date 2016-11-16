import { MainPageComponent } from './components/mainpage/mainpage.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/notfound/notfound.component';

export const APP_ROUTES = [
	{
		path: 'home',
		name: 'Home',
		component: MainPageComponent
	},
	{
		path: '',
		pathMatch: 'full',
		redirectTo: '/home'
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: '404',
		name: 'NotFound',
		component: NotFoundComponent
	},
	{
		path: '**',
		redirectTo: '/404'
	}
];