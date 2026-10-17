import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData } from '../../../shared/interfaces/auth-response.interface';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  authMode: string = "login";
  error: string | null = null;
  isLoading: boolean = false;
  readonly nameMaxLength = 25;
  readonly emailMaxLength = 254;
  readonly passwordMaxLength = 64;

  constructor(private router:Router,activeRoute: ActivatedRoute,private authService: AuthService){
    this.authMode = activeRoute.snapshot.url[1]?.path === 'login' ? 'login' : 'register';
  }

  get submitLabel(): string {
    if (this.isLoading) {
      return this.authMode === "login" ? "Logging in" : "Creating account";
    }
    return this.authMode === "login" ? "Login Now" : "Register Now";
  }

  lengthOf(value: unknown): number {
    return typeof value === "string" ? value.length : 0;
  }

  onSubmit(form: NgForm){
    if (this.isLoading) {
      return;
    }

    if (!form.valid) {
      form.control.markAllAsTouched();
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    this.error = null;
    this.isLoading = true;
    let authObservable: Observable<AuthResponseData>;

    if(this.authMode === "login"){
      authObservable = this.authService.login(email,password)
    }else if(this.authMode ==="register"){
      authObservable = this.authService.signUp(email,password,form.value.firstName,form.value.lastName)
    }else{
      this.isLoading = false;
      return;
    }

    authObservable.subscribe( () => {
      this.router.navigate(["/account"])
    }, errorMessage => {
      this.isLoading = false;
      this.error = errorMessage;
    })
  }


  navigateBack(){
    this.router.navigateByUrl("")
  }

  changeAuthMode(){
    this.authMode = this.authMode === "login" ? "register" : "login"
    this.router.navigateByUrl("/auth/" + this.authMode)
  }

  removeErrorMessage(){
    if(this.error) this.error = null;
  }
}
