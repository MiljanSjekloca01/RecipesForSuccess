import { Component, OnInit } from '@angular/core';
import { User } from '../../../../shared/models/user.model';
import { Recipe } from '../../../../shared/models/recipes.model';
import { AuthService } from '../../../../services/auth.service';
import { RecipeService } from '../../../../services/recipe.service';

@Component({
  selector: 'app-reviews-recipes',
  templateUrl: './reviews-recipes.component.html',
  styleUrl: './reviews-recipes.component.css'
})
export class ReviewsRecipesComponent implements OnInit{

  user!: User;
  recipes: Recipe[] = [];
  pressed: boolean[] = [];
  loading = true;
  shownCount = 8;
  
  constructor(private authService: AuthService,private recipeService: RecipeService){

    this.authService.user.subscribe(user => this.user = JSON.parse(JSON.stringify(user)))
  }


  ngOnInit(): void {
    this.recipeService.getReviewedRecipes(this.user?.id).subscribe({
      next: recipes => {
        this.recipes = recipes;
        this.pressed = new Array(this.recipes.length).fill(false);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  showMore(){
    this.shownCount += 8;
  }

  trackByRecipeId(index: number, recipe: Recipe): string {
    return recipe.id;
  }
}
