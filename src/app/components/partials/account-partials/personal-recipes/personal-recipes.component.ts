import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../../../services/recipe.service';
import { Recipe } from '../../../../shared/models/recipes.model';
import { User } from '../../../../shared/models/user.model';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-personal-recipes',
  templateUrl: './personal-recipes.component.html',
  styleUrl: './personal-recipes.component.css'
})
export class PersonalRecipesComponent implements OnInit{

  user: User;
  recipes: Recipe[];

  constructor(private recipeService: RecipeService,private authService: AuthService){
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

}
