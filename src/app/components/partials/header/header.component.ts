import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { AlertService } from "../../../services/alert.service";
import { Subscription } from "rxjs";

@Component({
    selector:"app-header",
    templateUrl:"header.component.html",
    styleUrl:"header.component.css"
})



export class HeaderComponent implements OnInit{
    isAuthenticated = false;
    userSub?: Subscription;

    constructor(private authService: AuthService, private alertService: AlertService, private router: Router){}

    onFavorites(){
        if (!this.isAuthenticated) {
            this.alertService.show("Please log in to view your favorites.", "info");
            return;
        }
        this.router.navigate(["/account/favorite-recipes"]);
    }

    isRecipesActive(): boolean {
        const path = this.currentPath();
        return !path.startsWith("/nutrition") && !path.startsWith("/account") && !path.startsWith("/auth");
    }

    isNutritionActive(): boolean {
        return this.currentPath().startsWith("/nutrition");
    }

    isAccountActive(): boolean {
        return this.currentPath().startsWith("/account");
    }

    private currentPath(): string {
        return this.router.url.split(/[?#]/)[0];
    }

    ngOnInit(): void {
        this.userSub = this.authService.user.subscribe(user => this.isAuthenticated = !!user)
    }

    ngOnDestroy(){
        this.userSub?.unsubscribe();
    }

    onLogout(){
        this.authService.logout();
    }
}