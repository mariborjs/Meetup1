import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RenderServiceProvider } from './services/render.service';
import { EngineServiceProvider } from './services/engine.service';
import { AppComponent } from './app.component';
import { AppDashboardComponent } from './components/app-dashboard';

@NgModule({
  declarations: [
    AppComponent,
    AppDashboardComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', component: AppDashboardComponent }
    ]),
    HttpModule,
    FormsModule
  ],
  providers: [
    RenderServiceProvider,
    EngineServiceProvider
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
