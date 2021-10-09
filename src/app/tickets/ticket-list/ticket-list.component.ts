import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { TicketsService } from '../tickets.service';
import { Ticket } from "../ticket.model";
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit, OnDestroy {

  tickets: Ticket[] = [];
  isLoading = false;
  totalTickets = 0;
  ticketsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId!: string | null;
  userRole!: string | null;
  userName!: string | null;

  etatSelection: any = 'ALL';


  private ticketsSub: Subscription = new Subscription;
  private authStatusSub: Subscription = new Subscription;

  constructor(public ticketsService: TicketsService,
    private authService: AuthService) { }

  ngOnInit() {

    this.isLoading = true;
    this.ticketsService.getTickets(this.ticketsPerPage, this.currentPage,this.etatSelection);
    this.userId = this.authService.getUserId();
    this.userName = this.authService.getUserName();
    this.userRole = this.authService.getUserRole();

    this.ticketsSub = this.ticketsService
      .getTicketUpdateListener()
      .subscribe((ticketData: { tickets: Ticket[]; ticketCount: number }) => {
        this.isLoading = false;
        this.totalTickets = ticketData.ticketCount;
        this.tickets = ticketData.tickets;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
        this.userRole = this.authService.getUserRole();
        this.userName = this.authService.getUserName();
      });
  }


  onChangedFilter(event: any) {
    this.isLoading = true;
    if (event.pageIndex!= null) {
      this.currentPage = event.pageIndex + 1;
    }
    if (event.pageSize!= null) {
      this.ticketsPerPage = event.pageSize;
    }
    if (event.value) {
      this.currentPage = 1;
      this.etatSelection = event.value;
    }

    this.ticketsService.getTickets(this.ticketsPerPage, this.currentPage,this.etatSelection);
  }


  ngOnDestroy() {
    this.ticketsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }


  handleTicket(ticket: any) {
    if (confirm("Etes vous sure de prendre ce ticket : " + ticket.intitule)) {
      this.ticketsService.handleTicketDetails(ticket);

    }
  }

}