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

  authMode: string = "login" || "register";
  error: string = null;

  constructor(private router:Router,activeRoute: ActivatedRoute,private authService: AuthService){
    if(activeRoute.snapshot.url[1].path === "login"){
      this.authMode = "login";
    }else this.authMode = "register";
  }


  onSubmit(form: NgForm){
    if(form.valid){
      console.log(form.value);
      const email = form.value.email;
      const password = form.value.password;
      this.error = null;
      let authObservable: Observable<AuthResponseData>;
      if(this.authMode === "login"){
        authObservable = this.authService.login(email,password)
      }else if(this.authMode ==="register"){
        const displayName = form.value.firstName + " " + form.value.lastName
        authObservable = this.authService.signUp(email,password)
      }
      
      authObservable.subscribe( resData => {
        this.router.navigate(["/account"])
      }, errorMessage => { this.error = errorMessage;})

    }else return
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
