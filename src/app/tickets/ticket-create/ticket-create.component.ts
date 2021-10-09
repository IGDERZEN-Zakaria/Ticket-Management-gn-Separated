import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Ticket } from '../ticket.model';
import { TicketsService } from '../tickets.service';

@Component({
  selector: 'app-ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.scss']
})
export class TicketCreateComponent implements OnInit, OnDestroy {

  private authStatusSub!: Subscription;
  isLoading = false;
  form!: FormGroup | any;

  ticket!: Ticket;


  constructor(
    public ticketsService: TicketsService,
    public route: ActivatedRoute,
    private authService: AuthService) { }


  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });

    this.form = new FormGroup({
      intitule: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      description: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      notes: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      delai: new FormControl(null)
    });

  }

  onSaveTicket() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.ticketsService.createTicket(
      this.form.value.intitule,
      this.form.value.description,
      this.form.value.notes,
      this.form.value.delai

    );

  }


  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

}
