import { Component, OnInit } from '@angular/core';
import { Client } from './model/client';
import { ClientService } from './service/client.service';
import { Router, ActivatedRoute} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public client: Client = new Client();
  public title: string = "Create Client";
  public errorList: string[] = [];
  constructor(private clientService: ClientService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadClient()
  }

  loadClient(): void {
    this.activatedRoute.params.subscribe(
      params => {
        let id = params['id']
        if(id){
          this.clientService.getClient(id).subscribe(
            (client) => this.client = client
          )
        }
      }
    )
  }

  updateClient(): void{
    this.clientService.updateClient(this.client)
    .subscribe(client => {
      this.router.navigate(['/clients'])
      Swal.fire('Client updated', `Client ${this.client.name} ${this.client.lastName} successfully updated!`, 'success')
    },
    err => {
      this.errorList = err.error.errors as string[];
      console.error(err.error.errors);      
    }
    );
  }

  create(): void{
    this.clientService.createClient(this.client)
    .subscribe(
      client => {        
        this.router.navigate(['/clients'])
        Swal.fire('New client ', `Client ${this.client.name} ${this.client.lastName} successfully created!`, 'success')
      },
      err => {
        this.errorList = err.error.errors as string [];
        console.error(err.error.errors);      
      }
    );
  }
}
