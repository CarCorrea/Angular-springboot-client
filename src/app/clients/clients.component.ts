import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Client } from './model/client';
import { ClientService } from './service/client.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})

export class ClientsComponent implements OnInit {

  clients!: Client[];  

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    this.clientService.getClients().subscribe(
      (clients) => this.clients = clients
    );
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
          response =>{
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
}
