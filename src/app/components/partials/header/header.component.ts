import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { Subscription } from "rxjs";

@Component({
    selector:"app-header",
    templateUrl:"header.component.html",
    styleUrl:"header.component.css"
})



export class HeaderComponent implements OnInit{
    isAuthenticated = false;
    alertVisible = false;
    alertMessage = "";
    alertType: "warning" | "errror" | "info" | "success" = "info";
    userSub?: Subscription;
    private alertTimer?: ReturnType<typeof setTimeout>;

    constructor(private authService: AuthService, private router: Router){}

    onFavorites(){
        if (!this.isAuthenticated) {
            this.showAlert("Please log in to view your favorites.", "info");
            return;
        }
        this.router.navigate(["/account/favorite-recipes"]);
    }

    private showAlert(message: string, type: "warning" | "errror" | "info" | "success"){
        this.alertMessage = message;
        this.alertType = type;
        this.alertVisible = true;
        clearTimeout(this.alertTimer);
        this.alertTimer = setTimeout(() => this.alertVisible = false, 5000);
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
        clearTimeout(this.alertTimer);
    }

    onLogout(){
        this.authService.logout();
    }
}