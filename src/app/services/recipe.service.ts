import { Injectable } from "@angular/core";
import { Observable, Subject, catchError, map, of, switchMap, throwError } from "rxjs";
import { Recipe } from "../shared/models/recipes.model";
import { sample_recipes } from "../data";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Review } from "../shared/models/review.model";

@Injectable({providedIn:"root"})
export class RecipeService {
    recipeAdded = new Subject<Recipe>
    private recipes: Recipe[] = [];

    constructor(private http: HttpClient){
        this.recipeAdded.subscribe(recipe => {
            this.recipes.push(recipe);
        })
    }

    getRecipes(){
        return this.recipes.slice();
    }

    //For testing data
    storeRecipes(){
        sample_recipes.forEach(recipe => 
            this.http.post<{name : string}>("https://recipesforsucces-cdfa9-default-rtdb.europe-west1.firebasedatabase.app/recipes.json",recipe).subscribe())
    }

    // Resolver
    getRecipesFromDatabase(): Observable<Recipe[]> {
        return this.http.get<{ [id: string]: Recipe }>(environment.FIREBASE_RECIPES_URL)
        .pipe(
            map(responseData => {
            const recipesArray: Recipe[] = [];
            for (const id in responseData) {
                if (responseData.hasOwnProperty(id)) {
                const recipe: Recipe = { ...responseData[id], id: id };
                recipe.ratings = [];
                if (recipe.reviews) {
                    recipe.reviews = Object.entries(recipe.reviews).map(([reviewsId,review]) => {
                        if(review.rating) recipe.ratings.push(review.rating);

                        if(review.likes){
                            review.likes = Object.entries(review.likes).map( ([likeId,like]) => {
                               return {...like}
                            })   
                        }
                        return {...review,id: reviewsId}
                    })
                }else{ recipe.reviews = []; }
            
                recipesArray.push(recipe);
                }
            }
            this.recipes = recipesArray;
            return recipesArray;
            }),
            catchError(errorRes => {
            return throwError(() => {
                return new Error("Couldnt get recipes from database");
            });
            })
        );
    }
   
    // Recipes component part
    getRecipesByTag(tagLink: string){
        this.getRecipesFromDatabase().subscribe(
            data => {
                this.recipes = data
            }
        )
        return this.recipes.filter( recipe => {
            return recipe.tags.some( tag => tag.toLowerCase().includes(tagLink.toLowerCase()))
    })}

    getRecipesBySearch(search: string){
        this.getRecipesFromDatabase().subscribe( data => this.recipes = data )
        if(!search || search == ""){
            return this.recipes;
        }else{
            return this.recipes.filter( recipe => {
                return recipe.title.toLowerCase().includes( search.toLowerCase())
                || recipe.tags.some( tag => tag.toLowerCase().includes(search.toLowerCase()))
            })
        }
    }

    getRecipeById(id: string){
        return this.recipes.find( recipe => recipe.id === id)
    }

    createRecipe(recipe: Recipe) {
        if (this.recipes.length === 0) {
          return this.getRecipesFromDatabase().pipe(
            switchMap(() => {
              return this.http.post<{ name: string }>(
                environment.FIREBASE_RECIPES_URL,
                recipe
              );
            })
          );
        } else {
          return this.http.post<{ name: string }>(
            environment.FIREBASE_RECIPES_URL,
            recipe
          );
        }
      }


    createReview(reviewData: Review,id: string){
        if(reviewData.rating || reviewData.commentText){
            return this.http.post<{name: string}>(
                `${environment.FIREBASE_BASE_RECIPES_URL}${id}/reviews.json`,
                reviewData) 
        }
    }

    addLikeToComment(recipeId: string, reviewId: string, likeData: { userId: string }) {
        return this.http.post<{ name: string }>(
            `${environment.FIREBASE_BASE_RECIPES_URL}${recipeId}/reviews/${reviewId}/likes.json`,
            likeData
        )
    }

    getRecipesByIds(recipeIds: string[]): Observable<Recipe[]> {
        if (this.recipes.length === 0) {
            return this.getRecipesFromDatabase().pipe(
                map(recipes => recipes.filter(recipe => recipeIds.includes(recipe.id)))
            );
        }

        return of(this.recipes.filter(recipe => recipeIds.includes(recipe.id)));
    }


}
