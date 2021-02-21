import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './clients.component';
import { ClientsResolver } from './resolvers/clients.resolver';
import { ClientCardComponent } from './client-card/client-card.component';
import { ClientHeadersComponent } from './client-headers/client-headers.component';
import { ClientFormComponent } from './client-form/client-form.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ClientsComponent, 
    ClientCardComponent,
    ClientHeadersComponent, 
    ClientFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ClientsRoutingModule
  ],
  providers: [ClientsResolver]
})
export class ClientsModule { }
