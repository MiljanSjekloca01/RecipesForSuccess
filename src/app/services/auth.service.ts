import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, catchError,tap, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { User } from "../shared/models/user.model";
import { environment } from "../../environments/environment";
import { AuthResponseData } from "../shared/interfaces/auth-response.interface";
import { Router } from "@angular/router";


@Injectable({providedIn:"root"})
export class AuthService implements OnInit{

    user = new BehaviorSubject<User>(null)

    private tokenExpirationTimer: any;
    //token: string = null;
    private SIGNUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.FIREBASE_WEB_API}`
    private SIGNIN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.FIREBASE_WEB_API}`
    private UPDATE_URL = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${environment.FIREBASE_WEB_API}`
    
    constructor( private http: HttpClient, private router: Router){
        this.user.subscribe(user => console.log(user))
    }
    ngOnInit(): void { }

    signUp(email: string,password: string){
        const userData = {email: email, password: password, returnSecureToken: true}
        return this.http.post<AuthResponseData>(this.SIGNUP_URL,userData)
        .pipe(catchError(this.handleError),
        tap(
            resData => { console.log(resData);this.handleAuthentication( resData.email, resData.localId, resData.idToken, resData.expiresIn); }
        )
        )
    }

    login(email: string,password: string){
        const userData = {email: email,password: password,returnSecureToken: true}
        return this.http.post<AuthResponseData>(
            this.SIGNIN_URL,userData)
            .pipe(catchError(this.handleError),
            tap(
                resData => {
                   this.handleAuthentication(
                    resData.email,
                    resData.localId,
                    resData.idToken,
                    resData.expiresIn)
                }
            ));
    }


    logout(){
        localStorage.removeItem("userData");
        this.user.next(null);
        this.router.navigate([""]);
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: string) {
        const expirationDate = new Date( new Date().getTime() + +expiresIn * 1000)
        const user = new User(email,userId,token,expirationDate);
        this.user.next(user);
        console.log(+expiresIn);
        this.autoLogout(+expiresIn * 1000);

        localStorage.setItem("userData",JSON.stringify(user));
    
    }

    private handleError(errorRes: HttpErrorResponse){
        let errorMessage = "An unkown error occured during singup procces!";
                if(!errorRes.error || !errorRes.error.error){
                    return throwError(errorMessage);
                }
                switch(errorRes.error.error.message){
                    case "EMAIL_EXISTS":
                        errorMessage = " This email is already taken ! ";
                        break;
                    case "OO_MANY_ATTEMPTS_TRY_LATER":
                        errorMessage = "e have blocked all requests from this device due to unusual activity. Try again later ! "
                        break;
                    case "EMAIL_NOT_FOUND":
                        errorMessage = " User with such email doesnt exists ! ";
                        break;
                    case "INVALID_PASSWORD":
                        errorMessage = " The password is invalid or the user does not have a password";
                        break;
                    case "USER_DISABLED":
                        errorMessage = " The user account has been disabled by admin! ";
                        break;
                    case "INVALID_LOGIN_CREDENTIALS":
                        errorMessage = "Email and password dont match an existing account."    
                        break;
                }
                return throwError(errorMessage);
    }

    autoLogout(expirationDuration: number){
        console.log("Token expires in " + expirationDuration / 1000)
        this.tokenExpirationTimer = setTimeout(() =>{
            this.logout();
        },expirationDuration)
    }


    autoLogin(){
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem("userData"));

        if(!userData){
            return;
        }
        
        const loadedUser = new User(userData.email,userData.id,userData._token, new Date(userData._tokenExpirationDate))

        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
        this.autoLogout(expirationDuration)
        // ako je valid token ili nije istekao
        if(loadedUser.token){
            this.user.next(loadedUser);
        }
    }
}





