import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientHeadersComponent } from './client-headers.component';

describe('ClientHeadersComponent', () => {
  let component: ClientHeadersComponent;
  let fixture: ComponentFixture<ClientHeadersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientHeadersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientHeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
