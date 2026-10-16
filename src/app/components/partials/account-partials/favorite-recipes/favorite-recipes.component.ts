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

  user!: User;
  recipes: Recipe[] = [];
  removingId: string = "";
  alertVisible = false;
  alertMessage = "";
  alertType = "";
    
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

  removeFavorite(recipeId: string){
    if(this.removingId) return;

    this.removingId = recipeId;
    this.authService.removeRecipeFromFavorites(recipeId).subscribe({
      next: () => {
        this.recipes = this.recipes.filter(recipe => recipe.id !== recipeId);
        const updated = (this.authService.user.value?.favoriteRecipes || []).filter(id => id !== recipeId);
        this.authService.updateFavoriteRecipes(updated);
        this.removingId = "";
        this.showAlertMessage("Recipe removed from favorites", "success");
      },
      error: () => {
        this.removingId = "";
        this.showAlertMessage("Could not remove this recipe.", "error");
      }
    });
  }

  showAlertMessage(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.alertVisible = true;
    setTimeout(() => { this.alertVisible = false; }, 5000);
  }

}

