import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Client } from './model/client';
import { ClientService } from './service/client.service';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './details/modal.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})

export class ClientsComponent implements OnInit {

  clients: Client[];
  paginator: any;
  selectedClient: Client;

  constructor(private clientService: ClientService, private modalService: ModalService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.clientService.getClients(page).subscribe(
        (response: any) => {
          this.clients = response.content as Client[]
          this.paginator = response;
        }
      )
    }
    );

    this.modalService.notifyUpload.subscribe(client => {
      this.clients = this.clients.map(originalClient => {
        if (client.id == originalClient.id) {
          originalClient.profilePic = client.profilePic
        }
        return originalClient;
      })
    })
  }

  deleteClient(client: Client): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-1',
        cancelButton: 'btn btn-danger mx-1'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.deleteClient(client.id).subscribe(
          response => {
            this.clients = this.clients.filter(cli => cli !== client)
            swalWithBootstrapButtons.fire(
              'Deleted!',
              `The client ${client.name} ${client.lastName} has been deleted successfully.`,
              'success'
            )
          }
        )

      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'The client remains subscribed',
          'error'
        )
      }
    })
  }

  openModal(client: Client) {
    this.selectedClient = client;
    this.modalService.openModal();
  }
}
