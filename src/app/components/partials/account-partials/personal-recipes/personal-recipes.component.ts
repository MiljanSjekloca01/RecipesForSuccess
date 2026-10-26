import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../../../services/recipe.service';
import { Recipe } from '../../../../shared/models/recipes.model';
import { User } from '../../../../shared/models/user.model';
import { AuthService } from '../../../../services/auth.service';
import { AlertService } from '../../../../services/alert.service';

@Component({
  selector: 'app-personal-recipes',
  templateUrl: './personal-recipes.component.html',
  styleUrl: './personal-recipes.component.css'
})
export class PersonalRecipesComponent implements OnInit{

  user!: User;
  recipes: Recipe[] = [];
  deletingId = "";
  pendingRecipe: Recipe | null = null;
  editingRecipe: Recipe | null = null;

  constructor(private recipeService: RecipeService,private authService: AuthService,private alertService: AlertService){
    this.authService.user.subscribe(user => {
      this.user = JSON.parse(JSON.stringify(user));
    })
  }

  ngOnInit(): void {
    if(this.user){
      this.recipeService.getPersonalRecipes(this.user.id).subscribe(personalRecipes => {
        this.recipes = personalRecipes;
      })
    }
  }

  askToDelete(recipe: Recipe){
    if(this.deletingId || this.editingRecipe || recipe.userId !== this.user?.id) return;
    this.pendingRecipe = recipe;
  }

  askToEdit(recipe: Recipe){
    if(this.deletingId || this.pendingRecipe || recipe.userId !== this.user?.id) return;
    this.editingRecipe = recipe;
  }

  onRecipeSaved(recipe: Recipe){
    this.recipes = this.recipes.map(item => item.id === recipe.id ? recipe : item);
    this.editingRecipe = null;
  }

  cancelEdit(){
    this.editingRecipe = null;
  }

  confirmDelete(){
    const recipeId = this.pendingRecipe?.id;
    this.pendingRecipe = null;
    if(recipeId) this.deleteRecipe(recipeId);
  }

  cancelDelete(){
    this.pendingRecipe = null;
  }

  get deleteMessage(){
    const title = this.pendingRecipe?.title;
    return title
      ? `Are you sure you want to delete "${title}"?`
      : "Are you sure you want to delete this recipe?";
  }

  deleteRecipe(recipeId: string){
    if(this.deletingId) return;

    const recipe = this.recipes.find(item => item.id === recipeId);
    if(!recipe || recipe.userId !== this.user?.id) return;

    this.deletingId = recipeId;
    this.recipeService.deleteRecipe(recipeId).subscribe({
      next: () => {
        this.recipes = this.recipes.filter(item => item.id !== recipeId);
        this.deletingId = "";
        this.removeOwnFavorite(recipeId);
        this.alertService.show("Recipe deleted", "success");
      },
      error: () => {
        this.deletingId = "";
        this.alertService.show("Could not delete this recipe.", "error");
      }
    });
  }

  private removeOwnFavorite(recipeId: string){
    const favorites = this.authService.user.value?.favoriteRecipes || [];
    if(!favorites.includes(recipeId)) return;

    this.authService.removeRecipeFromFavorites(recipeId).subscribe({
      next: () => {
        this.authService.updateFavoriteRecipes(favorites.filter(id => id !== recipeId));
      }
    });
  }

}
