import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";


import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { AuthGuard } from "./auth/auth.guard";
import { HomeComponent } from "./layout/home/home.component";
import { TicketListComponent } from "./tickets/ticket-list/ticket-list.component";
import { TicketCreateComponent } from "./tickets/ticket-create/ticket-create.component";
import { TicketEditComponent } from "./tickets/ticket-edit/ticket-edit.component";

const routes: Routes = [
  { path: "", component: HomeComponent },

  { path: "listTickets", component: TicketListComponent },
  { path: "createTicket", component: TicketCreateComponent, canActivate: [AuthGuard] },
  { path: "editTicket/:ticketId", component: TicketEditComponent, canActivate: [AuthGuard] },

  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
