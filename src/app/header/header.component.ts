import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  userName!: string | null;
  userRole!: string | null;

  private authListenerSubs: Subscription = new Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userName = this.authService.getUserName();
        this.userRole = this.authService.getUserRole();
      });
      this.userName = this.authService.getUserName();
      this.userRole = this.authService.getUserRole();

  }

  onLogout() {
    this.authService.logout();
    this.userName =null;
    this.userRole =null;
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
