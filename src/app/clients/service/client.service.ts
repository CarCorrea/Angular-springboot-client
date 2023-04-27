import { Injectable } from '@angular/core';


import { Client } from '../model/client';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map, catchError } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClientService {  

  private clientsUrlEndPoint: string = 'http://localhost:8080/api/v1/clients';
  private baseurlEndPoint: string = 'http://localhost:8080/api/v1';
  private httpHeaders = new HttpHeaders({'Content-type' : 'application/json'});

  constructor(private http: HttpClient, private router: Router) { }

  getClients(page: number): Observable<any[]>{
    //return of(CLIENTS);
    return this.http.get(this.clientsUrlEndPoint + '/page/' + page).pipe(
      map((response: any) => {        
        (response.content as Client[]).map(client => {
          client.name = client.name.toUpperCase();                   
          //client.createAt = formatDate(client.createAt, 'EEEE dd de MMMM, yyyy', 'es');
          return client;
        });
        return response;
        }  
      )        
    );   
  }

  createClient(client: Client): Observable<Client>{
    return this.http.post<Client>(this.clientsUrlEndPoint, client,{headers: this.httpHeaders}).pipe(
      catchError(e => {        

        if(e.status==400){
          return throwError(e);
        }  

        console.error(e.error.message);
        Swal.fire(e.error.message, e.error.error, 'error');
        return throwError(() => new Error(e));
      })
    );
  }

  getClient(id: Number): Observable<Client>{
    return this.http.get<Client>(`${this.clientsUrlEndPoint}/${id}`).pipe(
      catchError(e =>{
        this.router.navigate(['/clients']);
        console.error(e.error.message);
        Swal.fire('Error editing client', e.error.message, 'error');
        return throwError(() => new Error(e));
      })
    );
  }

  updateClient(client: Client): Observable<Client>{
    return this.http.put<Client>(`${this.clientsUrlEndPoint}/${client.id}`, client, {headers: this.httpHeaders}).pipe(
      catchError(e =>{

        if(e.status==400){
          return throwError(e);
        }  

        console.error(e.error.message);
        Swal.fire(e.error.message, e.error.error, 'error');
        return throwError(() => new Error(e));
      })
    );
  }

  deleteClient(id: Number): Observable<Client>{
    return this.http.delete<Client>(`${this.clientsUrlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.message);
        Swal.fire(e.error.message, e.error.error, 'error');
        return throwError(() => new Error(e));
      })
    );
  }

  uploadProfilePic(file: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.clientsUrlEndPoint}/img`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }
}
