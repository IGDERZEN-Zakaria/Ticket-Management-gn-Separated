import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { Ticket } from './ticket.model';
import { environment } from 'src/environments/environment';
//import { tick } from '@angular/core/testing';


const BACKEND_URL = environment.apiUrl + "/tickets/";
const STORAGE_URL = environment.StorageUrl;

//const BACKEND_URL = "api/tickets";
//const STORAGE_URL = "http://localhost:3000/ticketFiles/";

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor(private http: HttpClient, private router: Router) { }
  private tickets: Ticket[] = [];
  private ticketsUpdated = new Subject<{ tickets: Ticket[]; ticketCount: number }>();


  createTicket(intitule: string, description: string, notes: string, delai: Date) {

    this.http
      .post<{ message: string; ticket: Ticket }>(
        BACKEND_URL,
        {
          intitule: intitule,
          description: description,
          notes: notes,
          delai: delai
        }
      )
      .subscribe(responseData => {
        this.router.navigate(["/listTickets"]);
      });
  }


  getTickets(ticketsPerPage: number, currentPage: number, etatSelection: string) {
    const queryParams = `?pagesize=${ticketsPerPage}&page=${currentPage}&etatSelection=${etatSelection}`;
    this.http
      .get<{ message: string; tickets: any; maxTickets: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(ticketData => {
          return {
            tickets: ticketData.tickets.map((ticket: { _id: any; intitule: any; description: any; notes: any; createdBy: any; treatedBy: any; etat: any; delai: any }) => {
              return {
                id: ticket._id,
                intitule: ticket.intitule,
                createdBy: ticket.createdBy,
                treatedBy: ticket.treatedBy,
                description: ticket.description,
                etat: ticket.etat,
                delai: ticket.delai,

              };
            }),
            maxTickets: ticketData.maxTickets
          };
        })
      )
      .subscribe(transformedTicketData => {
        this.tickets = transformedTicketData.tickets;
        this.ticketsUpdated.next({
          tickets: [...this.tickets],
          ticketCount: transformedTicketData.maxTickets
        });
      });
  }

  getTicketUpdateListener() {
    return this.ticketsUpdated.asObservable();
  }


  getTicket(id: string) {

    return this.http.get<{
      _id: string;
      intitule: string;
      description: string;
      notes: string;
      delai: Date;
      etat: string;
      createdBy: any | null;
      treatedBy: any | null;
      remarques: string;
      filePath: string;

    }>(BACKEND_URL + id);
  }


  resolveTicketDetails(id: string, intitule: string, remarques: string, fichier: File | string) {
    debugger

    const server_url = `${BACKEND_URL}resolve/${id}`;

    let ticketData: Ticket | FormData;

    ticketData = new FormData();
    ticketData.append("id", id);
    ticketData.append("remarques", remarques);
    ticketData.append("image", fichier, intitule);

    this.http
      .put(server_url, ticketData)
      .subscribe(response => {
        this.router.navigate(["/listTickets"]);
      });
  }

  handleTicketDetails(ticket: Ticket) {

    const server_url = `${BACKEND_URL}handle/${ticket.id}`;

    this.http
      .put(server_url, ticket)
      .subscribe(response => {
        this.getTickets(10, 1, 'ALL');
      });


  }

  getFileNamefromFilePath(url: string) {
    return url = url.replace(STORAGE_URL, '');
  }

  downloadFile(ticket: Ticket, fileName: string) {
    debugger
    const server_url = `${BACKEND_URL}ticketFiles/${ticket.id}`;
    var body = { fileName: fileName }

    return this.http.post(server_url, body, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
    // .subscribe(response => {
    //   console.log('log :', response);


  }


}
