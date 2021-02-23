import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { AppClient } from 'src/models/client';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {
  client: AppClient = {
    key: '',
    firstName: '',
    lastName: '',
    postalCode: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    isActive: true
  };

  path = this.activatedRoute.snapshot.url[0].path;

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    if (this.path === "edit") {
      this.restoreClientValues();
    }
  }
  restoreClientValues() {
    const clients = this.activatedRoute.snapshot.data[0] as AppClient[];
    const keyParam = this.activatedRoute.snapshot.params.key;
    const client = clients.find(client => client.key === keyParam);
    if (client) {
      this.client = client;
    }
  }

  onSubmit() {
    if (this.path === "new") {
      this.userService.postClient(this.client).subscribe(() => {
        this.router.navigate(['clients']);
      });
    } else if (this.path === "edit") {
      this.userService.updateClient(this.client).subscribe(() => {
        this.router.navigate(['clients']);
      });
    }
  }

  onCancel() {
    this.router.navigate(['clients']);
  }
}
