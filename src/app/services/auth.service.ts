import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, catchError,map,mergeMap,switchMap,take,tap, throwError } from "rxjs";
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

    signUp(email: string, password: string, firstName: string, lastName: string,favoriteCuisine = "",dietaryPreference = "",favoriteRecipes = [],firebaseId = "") {
        const signupData = { email, password, returnSecureToken: true };
        let user = { id: "", firstName, lastName, email, favoriteCuisine, dietaryPreference, favoriteRecipes, firebaseId}
        return this.http.post<AuthResponseData>(this.SIGNUP_URL, signupData).pipe(
            catchError(this.handleError),
            mergeMap(resData => {
                user.id = resData.localId
                return this.createUserInDatabase(user).pipe(
                    map(() => {
                        return { ...resData, firstName, lastName, favoriteCuisine, dietaryPreference, favoriteRecipes, firebaseId: user.firebaseId};
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
                    result.dietaryPreference,
                    result.favoriteRecipes,
                    result.firebaseId
                    
                );
            })
        );
    }
    
    private createUserInDatabase(user: {id: string, firstName: string, lastName:string, email: string, favoriteCuisine: string, dietaryPreference: string, firebaseId: string}) {
        return this.http.post<{name: string}>(environment.FIREBASE_CREATE_USER_URL, user).pipe(
            catchError(this.handleError),
            tap(response => {
                user.firebaseId = response.name;
            })
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
                    result.dietaryPreference,
                    result.favoriteRecipes,
                    result.firebaseId
                );
            })
        );
    }

    private getUserFromDatabase(userId: string) {
        return this.http.get<{ [key: string]: User }>(environment.FIREBASE_CREATE_USER_URL).pipe(
            map(usersData => {
                
                const usersEntries = Object.entries(usersData);
                
                const userEntry = usersEntries.find(([firebaseId, user]) => user.id === userId);
                const [firebaseId, user] = userEntry;  
                
                if (user.favoriteRecipes) {
                    const favoriteRecipeIds = Object.values(user.favoriteRecipes as any as {recipeId: string}[]).map(obj => obj.recipeId);
                    console.log(favoriteRecipeIds)
                    user.favoriteRecipes = favoriteRecipeIds;
                }

                user.firebaseId = firebaseId
                return user;
              
            }),
            catchError(this.handleError)
        );
    }


    logout() {
        if (this.router.url.includes("account")) {
            this.router.navigate([""]).then(() => {
                localStorage.removeItem("userData");
                this.user.next(null);
                if (this.tokenExpirationTimer) {
                    clearTimeout(this.tokenExpirationTimer);
                }
            });
        } else {

            localStorage.removeItem("userData");
            this.user.next(null);
            if (this.tokenExpirationTimer) {
                clearTimeout(this.tokenExpirationTimer);
            }
        }
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: string,firstName: string,lastName:string,favoriteCuisine: string,dietaryPreference: string,favoriteRecipes: string[],firebaseId: string) {
        const expirationDate = new Date( new Date().getTime() + +expiresIn * 1000)
        const user = new User(email,userId,token,expirationDate,firstName,lastName,favoriteCuisine,dietaryPreference,favoriteRecipes,firebaseId);
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
            dietaryPreference: string,
            favoriteRecipes: string[],
            firebaseId: string;
        } = JSON.parse(localStorage.getItem("userData"));
        if(!userData){
            return;
        }
        
        const loadedUser = new User(userData.email,userData.id,userData._token, new Date(userData._tokenExpirationDate),userData.firstName,userData.lastName,userData.favoriteCuisine,userData.dietaryPreference,userData.favoriteRecipes,userData.firebaseId)
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
        this.autoLogout(expirationDuration)
        
        if(loadedUser.token){
            this.user.next(loadedUser);
        }
    }

    addRecipeToFavorites(recipeId: string) {
        return this.user.pipe(
            take(1), 
            switchMap(user => {
                if (!user) { return throwError('User not found'); }

                const favoriteRecipe = { recipeId };
                return this.http.post<{ name: string }>( `${environment.FIREBASE_BASE_USERS_URL}/${user.firebaseId}/favoriteRecipes.json`, favoriteRecipe )
            })
        );
    }
}





