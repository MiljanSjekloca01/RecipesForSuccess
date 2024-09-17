import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { Subscription } from "rxjs";

@Component({
    selector:"app-header",
    templateUrl:"header.component.html",
    styleUrl:"header.component.css"
})



export class HeaderComponent implements OnInit{

    isAuthenticated = false;
    userSub: Subscription;

    constructor(private authService: AuthService){}

    ngOnInit(): void {
        this.userSub = this.authService.user.subscribe(user => this.isAuthenticated = !!user)
    }

    ngOnDestroy(){
        this.userSub.unsubscribe();
    }

    onLogout(){
        this.authService.logout();
    }
}