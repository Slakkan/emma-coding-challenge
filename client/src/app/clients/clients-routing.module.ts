import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientFormComponent } from './client-form/client-form.component';

import { ClientsComponent } from './clients.component';
import { ClientsResolver } from './resolvers/clients.resolver';

const routes: Routes = [
  { path: '', component: ClientsComponent, resolve: [ClientsResolver] },
  { path: 'new', component: ClientFormComponent },
  { path: 'edit/:key', component: ClientFormComponent, resolve: [ClientsResolver] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
