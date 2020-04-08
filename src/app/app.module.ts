import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from "@angular/material/button";
import { PageNotFoundComponent } from "../shared/dummyComponents/page-not-found/page-not-found.component";
import { DashboardComponent } from "../smartComponents/dashboard/dashboard.component";
import { NavigationComponent } from "../shared/dummyComponents/navigation/navigation.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { LoaderComponent } from "../shared/dummyComponents/loader/loader.component";
import { ProfileComponent } from "../smartComponents/profile/profile.component";
import { WellcomeComponent } from "../shared/dummyComponents/wellcome/wellcome.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import {HttpClientModule} from "@angular/common/http";
import {MatListModule} from "@angular/material/list";

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    DashboardComponent,
    NavigationComponent,
    LoaderComponent,
    ProfileComponent,
    WellcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    HttpClientModule,
    MatListModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
