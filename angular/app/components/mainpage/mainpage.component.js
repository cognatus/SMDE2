"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var app_constants_1 = require('./../../app.constants');
var users_service_1 = require('./users.service');
var MainPageComponent = (function () {
    function MainPageComponent(config, usersService) {
        this.config = config;
        this.usersService = usersService;
    }
    MainPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.usersService.getUsers()
            .subscribe(function (users) { return _this.users = users; });
    };
    MainPageComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'main-page',
            templateUrl: 'mainpage.component.html',
            styleUrls: ['mainpage.component.css'],
            providers: [users_service_1.UsersService]
        }), 
        __metadata('design:paramtypes', [app_constants_1.Configuration, users_service_1.UsersService])
    ], MainPageComponent);
    return MainPageComponent;
}());
exports.MainPageComponent = MainPageComponent;
//# sourceMappingURL=mainpage.component.js.map