import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { AlertService } from '../../../../services/alert.service';
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
  loading = true;
  shownCount = 8;
    
  constructor(private authService: AuthService,private recipeService:RecipeService,private alertService: AlertService){

    this.authService.user.subscribe(user => {
      this.user = JSON.parse(JSON.stringify(user));
    })
  }

  
  ngOnInit(){
    const ids = this.user?.favoriteRecipes || [];
    if(!ids.length){
      this.loading = false;
      return;
    }

    this.recipeService.getRecipesByIds(ids).subscribe({
      next: recipes => {
        this.recipes = recipes;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  showMore(){
    this.shownCount += 8;
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
        this.alertService.show("Recipe removed from favorites", "success");
      },
      error: () => {
        this.removingId = "";
        this.alertService.show("Could not remove this recipe.", "error");
      }
    });
  }

}

