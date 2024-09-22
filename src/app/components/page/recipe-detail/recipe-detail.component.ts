import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../../services/recipe.service';
import { Recipe } from '../../../shared/models/recipes.model';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../shared/models/user.model';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css'
})
export class RecipeDetailComponent implements OnInit{

  recipe: Recipe;
  clickedStarIndex: number;
  ratingText: string;
  comment: string = "";
  userHaveRated: boolean;
  user: User;
  maxCommentsPerUser = 4;
  recipesCommentNumber = 2;

  constructor(activedRoute: ActivatedRoute,private recipeService: RecipeService,private authService: AuthService){
    activedRoute.params.subscribe( param => {
      if(param.id){
        this.recipe = this.recipeService.getRecipeById(param.id);
      }
    })
    this.authService.user.subscribe(user => this.user = user)
  }

  ngOnInit(){
    this.userHaveRated = this.findIfUserHaveRatedRecipe();
  }

  onSubmit(rating: number,comment: string){
    if(!this.user) return;
    if(comment){
      if (this.countUserComments() >= this.maxCommentsPerUser) {
        alert(`You have reached the maximum limit of ${this.maxCommentsPerUser} comments.`);
        return;
      }
    }
    const userName = this.user.firstName + " " + this.user.lastName
    if(rating && comment){
      this.recipeService.createReview(this.recipe.id,rating,comment,this.user.id,userName);
      this.userHaveRated = true;
    }else if(rating && !comment){
      this.recipeService.createReview(this.recipe.id,rating,null,this.user.id,userName);
      this.userHaveRated = true;
    }else{
      this.recipeService.createReview(this.recipe.id,null,comment,this.user.id,userName);
    }
    
    this.clickedStarIndex = 0;
    this.comment = "";

  }
  
  onStarClicked(star:number){
   this.clickedStarIndex = star;
   const ratingTexts = {
    1: "Bad recipe !",
    2: "Didn't like it",
    3: "It was good",
    4: "Great recipe",
    5: "Loved it !"
  };
  this.ratingText = ratingTexts[star];
  }


  findIfUserHaveRatedRecipe(){
    if(this.user.id && this.recipe.reviews){
      return this.recipe.reviews.some(review => {
       return review.rating && review.user_id === this.user.id
      })
    }
    return false;
  }

  findIfRecipeHasCommentReview(){
    if(this.recipe.reviews){
      this.recipe.reviews.forEach(review => {
        if(review.commentText){
          return true;
        }
      })
    }else{
      return false;
    }
  }

  countUserComments(): number {
    if (this.user.id && this.recipe.reviews) {
      return this.recipe.reviews.filter(review => review.user_id === this.user.id && review.commentText).length;
    }
    return 0;
  }


}
