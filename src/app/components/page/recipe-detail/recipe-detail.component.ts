import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../../services/recipe.service';
import { Recipe } from '../../../shared/models/recipes.model';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../shared/models/user.model';
import { Review } from '../../../shared/models/review.model';


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
  savedRecipe: boolean;
  maxCommentsPerUser = 4;
  recipesCommentNumber = 2;
  likedReviews: { [key: string]: boolean } = {};

  constructor(activedRoute: ActivatedRoute,private recipeService: RecipeService,private authService: AuthService,private router: Router){
      activedRoute.params.subscribe( param => {
      if(param.id){
        this.recipe = this.recipeService.getRecipeById(param.id);
      }
    })
    this.authService.user.subscribe(user => this.user = user);
  }

  ngOnInit(){
    this.userHaveRated = this.findIfUserHaveRatedRecipe();
    this.cacheLikedReviews();
    this.savedRecipe = this.user ? this.user.favoriteRecipes?.includes(this.recipe.id) : false;
  }

  cacheLikedReviews() {
    if (!this.user || !this.recipe.reviews) return;
  
    this.recipe.reviews.forEach(review => {
      if (review.likes) {
        this.likedReviews[review.id] = review.likes.some(like => like.userId === this.user?.id);
      } else {
        this.likedReviews[review.id] = false;
      }
    });
  }

  onSubmit(rating: number,comment: string){
    if(!this.user) return;

    const userName = this.user.firstName + " " + this.user.lastName
    const reviewData: Review = {user_id: this.user.id,by: userName}

    if(comment){
      reviewData.commentText = comment;
      if (this.countUserComments() >= this.maxCommentsPerUser) {
        alert(`You have reached the maximum limit of ${this.maxCommentsPerUser} comments.`);
        return;
      }
    }

    if(rating) {this.userHaveRated = true; reviewData.rating = rating};

    this.recipeService.createReview(reviewData,this.recipe.id).subscribe( response => {
      reviewData.id = response.name;
      this.recipe.ratings.push(rating);
      this.recipe.reviews.push(reviewData)
    },error => {alert("Error occured creating review !")});
  
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
    if(!this.user) return false;
    if(this.recipe.reviews){
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

  handleLikeClick(review: Review) {
    if (!this.user) return;
    
    let alreadyLiked: boolean = false;

    if(review.likes){
      alreadyLiked = review.likes.some(like => like.userId === this.user?.id );
    }

    if (!alreadyLiked) {
        const likeData = { userId: this.user.id };
        this.recipeService.addLikeToComment(this.recipe.id, review.id, likeData).subscribe(response => {
          if(!review.likes){ review.likes = []; }

           review.likes.push(likeData)
           this.likedReviews[review.id] = true; // Ažuriraj status
        }, error => {
            console.error("Error adding like", error);
        });
    } else {
        alert("You have already liked this comment.");
    }
  }

  addToFavorite(recipeId: string){
    if(this.user){
      this.savedRecipe = true;
      this.authService.addRecipeToFavorites(recipeId).subscribe({
        next: res => {
          this.user.favoriteRecipes.push(recipeId);
          localStorage.setItem("userData", JSON.stringify(this.user));

        },error: err => {
          alert('Error adding recipe to favorites:' + err)
        },complete: () => {
          alert("Recipe successfully added to favorites");
        }
      })
    }else{
      this.router.navigate(["/auth/login"])
    }
  }

}
