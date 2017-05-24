import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AUTH_PROVIDERS } from 'angular2-jwt';
import { AuthGuard } from './auth/auth.guard';

import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { MenuComponent } from './menu/menu.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageConversationComponent } from './message-conversation/message-conversation.component';
import { AdminComponent } from './admin/admin.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserCoursesComponent } from './user-courses/user-courses.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { GroupsComponent } from './groups/groups.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SignupComponent,
    MenuComponent,
    MessagesComponent,
    MessageConversationComponent,
    AdminComponent,
    UsersComponent,
    UserDetailComponent,
    UserCoursesComponent,
    SubjectsComponent,
    GroupsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
