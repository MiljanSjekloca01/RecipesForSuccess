import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { RecipeService } from '../../../services/recipe.service';
import { Recipe } from '../../../shared/models/recipes.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipes',
  templateUrl:'./recipes.component.html',
  styleUrl: './recipes.component.css',
})
export class RecipesComponent implements OnInit,OnDestroy{ 

  constructor(private recipeService: RecipeService,private activeRoute: ActivatedRoute){}

  recipes: Recipe[] = [];
  recipesShownNumber: number = 8;
  routeSubscription: Subscription;
  pageTitle = "All";
  showSwiper: boolean;

  ngOnInit(){
    this.routeSubscription = this.activeRoute.params.subscribe( param => {
      this.recipesShownNumber = 8;
      if(param.tag){
        this.showSwiper = false;
        this.pageTitle = param.tag
        this.recipes = this.recipeService.getRecipesByTag(param.tag)
      }else if(param.search || param.search === ""){
        this.showSwiper = false;
        this.recipes = this.recipeService.getRecipesBySearch(param.search)
        if(this.recipes.length) this.pageTitle = "Results for " + param.search
      }else{
        this.recipes = this.recipeService.getRecipes();
        this.showSwiper = true;
      }

    })

    this.recipeService.recipeAdded.subscribe(recipe => {
      this.recipes.push(recipe);
    });

  }

  onShowMoreRecipes(){
    this.recipesShownNumber += 4;
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  storeRecipes(){
    this.recipeService.storeRecipes();
  }

  calculateAverageRating(ratings: number[]){
    if(ratings.length === 1){
      return ratings[0];
    }
    return Math.round((ratings.reduce( (acc,current) => acc + current,0)) / ratings.length);
  }


}
