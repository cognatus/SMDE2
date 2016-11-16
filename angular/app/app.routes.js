"use strict";
var mainpage_component_1 = require('./components/mainpage/mainpage.component');
var login_component_1 = require('./components/login/login.component');
var notfound_component_1 = require('./components/notfound/notfound.component');
exports.APP_ROUTES = [
    {
        path: 'home',
        name: 'Home',
        component: mainpage_component_1.MainPageComponent
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home'
    },
    {
        path: 'login',
        component: login_component_1.LoginComponent
    },
    {
        path: '404',
        name: 'NotFound',
        component: notfound_component_1.NotFoundComponent
    },
    {
        path: '**',
        redirectTo: '/404'
    }
];
//# sourceMappingURL=app.routes.js.map