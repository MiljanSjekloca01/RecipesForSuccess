import { Component } from '@angular/core';
import { Recipe } from '../../../../shared/models/recipes.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { RecipeService } from '../../../../services/recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrl: './create-recipe.component.css'
})

export class CreateRecipeComponent {
  cuisines: string[] = ['Italian', 'Mexican', 'Chinese', 'Indian', 'French', 'Japanese', 'Mediterranean', 'Serbian'];
  meals: string[] = ["Breakfast","Dinner","Lunch","Drink","Dessert","Snack","Appetizer"];
  dishTypes: string[] = [ 'Pizza', 'Salad', 'Pasta', 'Burger', 'Sushi', 'Steak', 'Tacos', 'Soup', 'Curry', 'Sandwich', 'Seafood', 'Vegetarian', 'Grilled Chicken', 'Fried Rice' ];
  dietPreferences: string[] = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'];
  prepTimeMax: number;
  prepTimeMin: number;
  cookTimeMin: number;
  cookTimeMax: number;
  meal: string = "";
  dishType: string = "";
  recipe: Recipe = {
    id: '',
    title: "",
    description: '',
    imageUrl: '',
    prepTime: '',
    cuisine: '',
    owner: '',
    tags: [],
    servings: "",
    ingredients: [""],
    steps:[""],
    reviews: [],
    ratings: [],
    userId: "",
    dietPreference: "",
  };
  alertVisible = false;
  alertMessage = "";
  alertType = "";


  constructor(private authService: AuthService,private recipeService: RecipeService,private router: Router){
    this.authService.user.subscribe(user => {
      if(user){
        this.recipe.userId = user.id
        this.recipe.owner = user.firstName + " " + user.lastName
      }
    })
  }

  addIngredient() {
    if (this.recipe.ingredients) {
      this.recipe.ingredients.push('');
    }
  }

  removeIngredient(index: number) {
    if (this.recipe.ingredients) {
      this.recipe.ingredients.splice(index, 1);
    }
  }

  addDirection() {
    if (this.recipe.steps) {
      this.recipe.steps.push(''); 
    }
  }

  removeDirection(index: number) {
    if (this.recipe.steps) {
      this.recipe.steps.splice(index, 1);
    }
  }

  cancel(form: NgForm) { form.reset(); }

  onSubmit(form: NgForm) {
    if(form.valid){
      this.recipe.prepTime = this.prepTimeMin.toString() + "-" + this.prepTimeMax.toString();
      this.recipe.tags.push(this.meal);
      if(this.dishType) this.recipe.tags.push(this.dishType);
      if(this.cookTimeMin && this.cookTimeMax) this.recipe.cookTime = `${this.cookTimeMin}-${this.cookTimeMax}`
      this.recipeService.createRecipe(this.recipe).subscribe({
        next: (resData) => {
          this.recipe.id = resData.name;
          this.recipeService.recipeAdded.next(this.recipe);
        },
        error: (err) => {
          console.error(err);
          this.showAlertMessage("Error occured creating recipe! ","error");
        },
        complete: () => {
          this.showAlertMessage("Recipe succesfully created !","success");
          setTimeout(() => { this.router.navigate(["/"]); }, 1500);
        }
      })
    } 
  }

  trackByFn(index: number, item: any) {
    return index; 
  }

  showAlertMessage(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.alertVisible = true;

    setTimeout(() => {
        this.alertVisible = false;
    }, 3000);
  }

}