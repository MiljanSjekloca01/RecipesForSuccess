import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, catchError,map,mergeMap,switchMap,tap, throwError } from "rxjs";
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
    
    constructor( private http: HttpClient, private router: Router){}
    ngOnInit(): void { }

    signUp(email: string, password: string, firstName: string, lastName: string,favoriteCuisine = "",dietaryPreference = "") {
        const signupData = { email, password, returnSecureToken: true };
        let user = { id: "", firstName, lastName, email, favoriteCuisine, dietaryPreference}
        return this.http.post<AuthResponseData>(this.SIGNUP_URL, signupData).pipe(
            catchError(this.handleError),
            mergeMap(resData => {
                user.id = resData.localId
                return this.createUserInDatabase(user).pipe(
                    map(() => {
                        return { ...resData, firstName, lastName, favoriteCuisine, dietaryPreference};
                    })
                );
            }),
            tap(result => {
                this.handleAuthentication(
                    result.email,
                    result.localId,
                    result.idToken,
                    result.expiresIn,
                    result.firstName,
                    result.lastName,
                    result.favoriteCuisine,
                    result.dietaryPreference
                );
            })
        );
    }
    
    private createUserInDatabase(user: {id: string, firstName: string, lastName:string, email: string, favoriteCuisine: string, dietaryPreference: string}) {
        return this.http.post(environment.FIREBASE_CREATE_USER_URL, user).pipe(
            catchError(this.handleError)
        );
    }


    login(email: string, password: string) {
        const userData = { email, password, returnSecureToken: true };
        return this.http.post<AuthResponseData>(this.SIGNIN_URL, userData).pipe(
            catchError(this.handleError),
            switchMap(resData => {
                return this.getUserFromDatabase(resData.localId).pipe(
                    map(userDetails => {
                        return { ...resData, ...userDetails };
                    })
                );
            }),
            tap(result => {
                this.handleAuthentication(
                    result.email,
                    result.localId,
                    result.idToken,
                    result.expiresIn,
                    result.firstName,
                    result.lastName,
                    result.favoriteCuisine,
                    result.dietaryPreference
                );
            })
        );
    }

    private getUserFromDatabase(userId: string) {
        return this.http.get<User>("https://recipesforsucces-cdfa9-default-rtdb.europe-west1.firebasedatabase.app/users.json").pipe(
            map(usersData => {
                const usersArray: User[] = Object.values(usersData);
                return usersArray.find(user => user.id === userId);
            }),
            catchError(this.handleError)
        );
    }


    logout(){
        localStorage.removeItem("userData");
        this.user.next(null);
        this.router.navigate([""]);
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: string,firstName: string,lastName:string,favoriteCuisine: string,dietaryPreference: string) {
        const expirationDate = new Date( new Date().getTime() + +expiresIn * 1000)
        const user = new User(email,userId,token,expirationDate,firstName,lastName,favoriteCuisine,dietaryPreference);
        this.user.next(user);
        this.autoLogout(+expiresIn * 1000);

        localStorage.setItem("userData",JSON.stringify(user));
    
    }

    private handleError(errorRes: HttpErrorResponse){
        let errorMessage = "An unkown error occured during procces!";
                if(!errorRes.error || !errorRes.error.error){
                    return throwError(errorMessage);
                }
                switch(errorRes.error.error.message){
                    case "EMAIL_EXISTS":
                        errorMessage = " This email is already taken ! ";
                        break;
                    case "OO_MANY_ATTEMPTS_TRY_LATER":
                        errorMessage = "We have blocked all requests from this device due to unusual activity. Try again later ! "
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
            firstName: string,
            lastName: string,
            favoriteCuisine: string,
            dietaryPreference: string
        } = JSON.parse(localStorage.getItem("userData"));
        if(!userData){
            return;
        }
        
        const loadedUser = new User(userData.email,userData.id,userData._token, new Date(userData._tokenExpirationDate),userData.firstName,userData.lastName,userData.favoriteCuisine,userData.dietaryPreference)
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
        this.autoLogout(expirationDuration)
        
        if(loadedUser.token){
            this.user.next(loadedUser);
        }
    }
}





