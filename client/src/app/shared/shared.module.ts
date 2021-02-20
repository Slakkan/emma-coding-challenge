import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginButtonComponent } from './components/login-button/login-button.component';

@NgModule({
  declarations: [LoginButtonComponent],
  imports: [CommonModule],
  exports: [LoginButtonComponent],
})
export class SharedModule {}
