import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/** Pages */
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { PlayComponent } from './pages/play/play.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

/** PrimeNG */
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms'; // required for textarea/inputs bindings
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { InputTextModule } from 'primeng/inputtext';

/** Services */
import { WebSocketService } from './services/web-socket.service';
import { ChatService } from './services/chat.service';
import { DrawSocketService } from './services/draw-socket.service';
import { DrawHelperService } from './services/draw-helper.service';
import { ApiService } from './services/api.service';

/** Others */
import { HttpClientModule }    from '@angular/common/http';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'play', component: PlayComponent},
  { path: '', 
    redirectTo: '/home', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlayComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true } // <- activate only on debug
    ),
    ButtonModule,
    InputTextareaModule,
    FormsModule,    
    InputTextModule,
    ScrollPanelModule,
    HttpClientModule
  ],
  providers: [
    WebSocketService,
    ChatService,
    DrawSocketService,
    DrawHelperService,
    ApiService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
