import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from "../shared/dummyComponents/page-not-found/page-not-found.component";
import { DashboardComponent } from "../smartComponents/dashboard/dashboard.component";
import { AuthGuard } from "../shared/guards/auth.guard";
import { ProfileComponent } from "../smartComponents/profile/profile.component";
import {WellcomeComponent} from "../shared/dummyComponents/wellcome/wellcome.component";


const routes: Routes = [
  { path: '', component: WellcomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'page_not_found', component:PageNotFoundComponent },
  { path: '**', redirectTo: 'page_not_found' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
