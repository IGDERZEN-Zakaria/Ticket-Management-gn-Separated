import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Ticket } from '../ticket.model';
import { TicketsService } from '../tickets.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-ticket-edit',
  templateUrl: './ticket-edit.component.html',
  styleUrls: ['./ticket-edit.component.scss']
})
export class TicketEditComponent implements OnInit {

  private authStatusSub!: Subscription;
  isLoading = false;
  form!: FormGroup | any;
  private ticketId!: string | any;
  filePreview!: string;
  userRole!: string | null;

  ticket!: Ticket;

  @Input('isReadOnly')
  isReadOnly: boolean = true;


  @Input('fileName')
  fileName: string = '****';

  constructor(public ticketsService: TicketsService,
    public route: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit(): void {

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.userRole = this.authService.getUserRole();

    this.form = new FormGroup({
      createdBy: new FormControl(null),
      intitule: new FormControl(null),
      description: new FormControl(null),
      notes: new FormControl(null),
      delai: new FormControl(null),
      remarques: new FormControl(null, { validators: [Validators.required, Validators.minLength(5)] }),
      selectedfile: new FormControl(null, {
        validators: [Validators.required]
      })

    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if (paramMap.has("ticketId")) {
        this.ticketId = paramMap.get("ticketId");
        this.isLoading = true;
        this.ticketsService.getTicket(this.ticketId).subscribe(ticketData => {
          this.isLoading = false;
          this.userRole = this.authService.getUserRole();
          this.ticket = {
            id: ticketData._id,
            intitule: ticketData.intitule,
            description: ticketData.description,
            notes: ticketData.notes,
            delai: ticketData.delai,
            etat: ticketData.etat,
            createdBy: ticketData.createdBy,
            treatedBy: ticketData.treatedBy,
            remarques: ticketData.remarques,
            filePath: ticketData.filePath,
          };
          this.form.setValue({
            createdBy: ticketData.createdBy.full_name,
            intitule: this.ticket.intitule,
            description: this.ticket.description,
            notes: this.ticket.notes,
            delai: this.ticket.delai,
            remarques: this.ticket.remarques,
            selectedfile: this.ticket.filePath || null
          });
          if (this.ticket.filePath != null) {
            this.fileName = this.ticket.filePath;
            this.fileName = this.ticketsService.getFileNamefromFilePath(this.ticket.filePath);
          }
        });

        if (this.userRole == 'ASSISTANT_DZ')
          this.isReadOnly = false;
      }
    });
  }




  onFileUpload(event: any) {

    const file = event.target.files[0];
    this.fileName = file.name;
    this.form.patchValue({ selectedfile: file });
    this.form.get("selectedfile").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.filePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
 
  onFileDowload() {


    this.ticketsService.downloadFile(this.ticket, this.fileName)
    .subscribe(
        result => saveAs(result,this.fileName),
        error => console.log(error));


  }



  onSaveTicket() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;


    this.ticketsService.resolveTicketDetails(
      this.ticketId,
      this.form.value.intitule,
      this.form.value.remarques,
      this.form.value.selectedfile);

    this.form.reset();
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }


}