import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { Configuration } from './app.constants';
import { APP_ROUTES } from './app.routes';
import { AppComponent } from './app.component';
import { AppBarComponent } from './components/app_bar/appbar.component';
import { MainPageComponent } from './components/mainpage/mainpage.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/notfound/notfound.component';

@NgModule({
  declarations: [ 
    AppComponent,
    NotFoundComponent,
  	AppBarComponent,
    MainPageComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(APP_ROUTES)
  ],
  providers: [Configuration],
  bootstrap: [AppComponent]
})
export class AppModule { }
