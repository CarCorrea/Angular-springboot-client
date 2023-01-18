import { Injectable, OnInit } from '@angular/core';
import { CLIENTS } from '../clients.json';
import { Client } from '../model/client';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClientService {  

  private urlEndPoint: string = 'http://localhost:8080/api/v1/clients';
  private httpHeaders = new HttpHeaders({'Content-type' : 'application/json'});

  constructor(private http: HttpClient, private router: Router) { }

  getClients(): Observable<Client[]>{
    //return of(CLIENTS);
    return this.http.get(this.urlEndPoint).pipe(
      map( response => response as Client[])
    );
  }

  createClient(client: Client): Observable<Client>{
    return this.http.post<Client>(this.urlEndPoint, client,{headers: this.httpHeaders}).pipe(
      catchError(e => {        

        if(e.status==400){
          return throwError(() => new Error(e));
        }  

        console.error(e.error.message);
        Swal.fire(e.error.message, e.error.error, 'error');
        return throwError(() => new Error(e));
      })
    );
  }

  getClient(id: Number): Observable<Client>{
    return this.http.get<Client>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e =>{
        this.router.navigate(['/clients']);
        console.error(e.error.message);
        Swal.fire('Error editing client', e.error.message, 'error');
        return throwError(() => new Error(e));
      })
    );
  }

  updateClient(client: Client): Observable<Client>{
    return this.http.put<Client>(`${this.urlEndPoint}/${client.id}`, client, {headers: this.httpHeaders}).pipe(
      catchError(e =>{

        if(e.status==400){
          return throwError(() => new Error(e));
        }  

        console.error(e.error.message);
        Swal.fire(e.error.message, e.error.error, 'error');
        return throwError(() => new Error(e));
      })
    );
  }

  deleteClient(id: Number): Observable<Client>{
    return this.http.delete<Client>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.message);
        Swal.fire(e.error.message, e.error.error, 'error');
        return throwError(() => new Error(e));
      })
    );
  }
}
