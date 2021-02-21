import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginButtonComponent } from './components/login-button/login-button.component';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  declarations: [LoginButtonComponent, PaginationComponent],
  imports: [CommonModule],
  exports: [LoginButtonComponent, PaginationComponent],
})
export class SharedModule {}
