import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginButtonComponent } from './components/login-button/login-button.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [LoginButtonComponent, PaginationComponent, ModalComponent],
  imports: [CommonModule],
  exports: [LoginButtonComponent, PaginationComponent, ModalComponent],
})
export class SharedModule {}
