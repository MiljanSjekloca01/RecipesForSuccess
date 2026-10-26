import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Recipe } from '../../../../shared/models/recipes.model';
import { AlertService } from '../../../../services/alert.service';
import { RecipeService } from '../../../../services/recipe.service';

@Component({
  selector: 'app-edit-recipe-modal',
  templateUrl: './edit-recipe-modal.component.html',
  styleUrl: './edit-recipe-modal.component.css'
})
export class EditRecipeModalComponent implements OnChanges {
  @Input() recipe: Recipe | null = null;
  @Output() saved = new EventEmitter<Recipe>();
  @Output() cancel = new EventEmitter<void>();

  cuisines: string[] = ['Italian', 'Mexican', 'Chinese', 'Indian', 'French', 'Japanese', 'Mediterranean', 'Serbian'];
  meals: string[] = ["Breakfast","Dinner","Lunch","Drink","Dessert","Snack","Appetizer"];
  dishTypes: string[] = [ 'Pizza', 'Pasta', 'Rice', 'Noodles', 'Soup', 'Salad', 'Sandwich', 'Burger', 'Tacos', 'Curry', 'Stew', 'Seafood', 'Chicken', 'Beef', 'Sushi', 'Other' ];
  dietPreferences: string[] = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'];

  draft: Recipe = this.emptyRecipe();
  prepTimeMin: number | null = null;
  prepTimeMax: number | null = null;
  cookTimeMin: number | null = null;
  cookTimeMax: number | null = null;
  meal = "";
  dishType = "";
  saving = false;

  constructor(private recipeService: RecipeService, private alertService: AlertService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes["recipe"]) this.fillFromRecipe(this.recipe);
  }

  @HostListener("document:keydown.escape")
  onEscape() {
    if (this.recipe && !this.saving) this.onCancel();
  }

  get cookTimeIncomplete() {
    return this.hasNumber(this.cookTimeMin) !== this.hasNumber(this.cookTimeMax);
  }

  addIngredient() {
    if (this.draft.ingredients && this.draft.ingredients.length <= 14) this.draft.ingredients.push('');
    else this.alertService.show("You cannot add more than 12 ingredients.", "info");
  }

  removeIngredient(index: number) {
    if (this.draft.ingredients && this.draft.ingredients.length !== 1) this.draft.ingredients.splice(index, 1);
    else this.alertService.show("At least one ingredient is required ! ", "info");
  }

  addDirection() {
    if (this.draft.steps && this.draft.steps.length <= 14) this.draft.steps.push('');
    else this.alertService.show("You cannot add more than 12 directions.", "info");
  }

  removeDirection(index: number) {
    if (this.draft.steps && this.draft.steps.length !== 1) this.draft.steps.splice(index, 1);
    else this.alertService.show("At least one direction is required ! ", "info");
  }

  onCancel() {
    if (this.saving) return;
    this.cancel.emit();
  }

  onSubmit(form: NgForm) {
    if (!this.recipe || !form.valid || this.saving || this.cookTimeIncomplete) return;

    const tags = [this.meal];
    if (this.dishType) tags.push(this.dishType);

    const updated: Recipe = {
      ...this.recipe,
      title: this.draft.title,
      description: this.draft.description,
      imageUrl: this.draft.imageUrl,
      prepTime: `${this.prepTimeMin}-${this.prepTimeMax}`,
      cuisine: this.draft.cuisine ?? "",
      tags,
      servings: this.draft.servings ? String(this.draft.servings) : "",
      ingredients: [...(this.draft.ingredients ?? [])],
      steps: [...(this.draft.steps ?? [])],
      dietPreference: this.draft.dietPreference ?? "",
      reviews: this.recipe.reviews,
      ratings: this.recipe.ratings,
    };

    if (this.hasNumber(this.cookTimeMin) && this.hasNumber(this.cookTimeMax)) {
      updated.cookTime = `${this.cookTimeMin}-${this.cookTimeMax}`;
    } else {
      delete updated.cookTime;
    }

    this.saving = true;
    this.recipeService.updateRecipe(updated).subscribe({
      next: (saved) => {
        this.saving = false;
        this.alertService.show("Recipe updated", "success");
        this.saved.emit(saved);
      },
      error: () => {
        this.saving = false;
        this.alertService.show("Could not update this recipe.", "error");
      }
    });
  }

  trackByFn(index: number) {
    return index;
  }

  private fillFromRecipe(recipe: Recipe | null) {
    this.saving = false;
    if (!recipe) return;

    this.draft = {
      ...JSON.parse(JSON.stringify(recipe)),
      ingredients: recipe.ingredients?.length ? [...recipe.ingredients] : [""],
      steps: recipe.steps?.length ? [...recipe.steps] : [""],
      cuisine: recipe.cuisine ?? "",
      dietPreference: recipe.dietPreference ?? "",
      servings: recipe.servings ?? "",
    };
    [this.prepTimeMin, this.prepTimeMax] = this.splitTime(recipe.prepTime);
    [this.cookTimeMin, this.cookTimeMax] = this.splitTime(recipe.cookTime);
    this.meal = recipe.tags?.find(tag => this.meals.includes(tag)) ?? "";
    this.dishType = recipe.tags?.find(tag => this.dishTypes.includes(tag)) ?? "";
  }

  private splitTime(value?: string): [number | null, number | null] {
    if (!value) return [null, null];
    const [min, max] = value.split("-");
    return [this.toNumber(min), this.toNumber(max)];
  }

  private toNumber(value?: string) {
    if (value == null || value.trim() === "") return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  private hasNumber(value: number | null) {
    return value != null;
  }

  private emptyRecipe(): Recipe {
    return { id: '', title: "", description: '', imageUrl: '', prepTime: '', cuisine: '', owner: '', tags: [], servings: "", ingredients: [""], steps: [""], reviews: [], ratings: [], userId: "", dietPreference: "" };
  }
}
