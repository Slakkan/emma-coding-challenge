import { Component, Input, OnInit } from '@angular/core';
import { AppClient } from 'src/models/client';

import { clientMock } from 'src/mocks/clientsMock';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.scss']
})
export class ClientCardComponent implements OnInit {
  @Input() client: AppClient = clientMock;

  isExpanded = false;
  animate = false;
  isTransitioning = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onEdit() {
    this.router.navigate(['clients', 'edit', this.client.key])
  }

  onExpand(event: MouseEvent) {
    if(event.target instanceof HTMLImageElement && event.target.id === 'client-card-edit') {
      return
    }

    this.isTransitioning = true;

    if (!this.isExpanded) {
      setTimeout(() => {
        this.animate = true;
        this.isTransitioning = false;
      }, 0);
    } else {
      setTimeout(() => {
        this.animate = false;
        this.isTransitioning = false;
      }, 0);
    }
    
    this.isExpanded = !this.isExpanded
  }
}
