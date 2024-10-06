import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { User } from '../../../../shared/models/user.model';
import { RecipeService } from '../../../../services/recipe.service';
import { Recipe } from '../../../../shared/models/recipes.model';

@Component({
  selector: 'app-favorite-recipes',
  templateUrl: './favorite-recipes.component.html',
  styleUrl: './favorite-recipes.component.css'
})
export class FavoriteRecipesComponent implements OnInit{

  user: User;
  recipes: Recipe[];
    
  constructor(private authService: AuthService,private recipeService:RecipeService){

    this.authService.user.subscribe(user => {
      this.user = JSON.parse(JSON.stringify(user));
    })
  }

  
  ngOnInit(){
    if(this.user.favoriteRecipes){
      this.recipeService.getRecipesByIds(this.user.favoriteRecipes).subscribe(recipes => {
        this.recipes = recipes;
      })
    }
  }

  calculateAverageRating(ratings: number[]){
    if(ratings.length === 1){
      return ratings[0];
    }
    return Math.round((ratings.reduce( (acc,current) => acc + current,0)) / ratings.length);
  }

}

