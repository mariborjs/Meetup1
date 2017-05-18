import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppLerpAnimationComponent } from './components/app-lerp-animation';

@NgModule({
  declarations: [
    AppComponent,
    AppLerpAnimationComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', component: AppLerpAnimationComponent }
    ])
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
