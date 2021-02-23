import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() info = '';
  @Input() submitText = 'OK';
  @Input() cancelText = 'cancel';

  @Output() modalSubmit = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.modalSubmit.emit(true)
  }

  onCancel(){
    this.modalSubmit.emit(false)
  }
}
