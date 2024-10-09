import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { CreateRecipeComponent } from "../../partials/account-partials/create-recipe/create-recipe.component";
import { FavoriteRecipesComponent } from "../../partials/account-partials/favorite-recipes/favorite-recipes.component";
import { PersonalInfoComponent } from "../../partials/account-partials/personal-info/personal-info.component";
import { PersonalRecipesComponent } from "../../partials/account-partials/personal-recipes/personal-recipes.component";
import { ReviewsRecipesComponent } from "../../partials/account-partials/reviews-recipes/reviews-recipes.component";
import { AccountComponent } from "./account.component";
import { SharedModule } from "../../../shared/shared.module";

const accountRoutes: Routes = [
  { 
    path: '', 
    component: AccountComponent, 
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: PersonalInfoComponent },
      { path: 'create-recipe', component: CreateRecipeComponent },
      { path: 'favorite-recipes', component: FavoriteRecipesComponent },
      { path: 'personal-recipes', component: PersonalRecipesComponent },
      { path: 'reviews-recipes', component: ReviewsRecipesComponent }
    ]
  }
];

@NgModule({
  declarations: [
    AccountComponent,
    PersonalInfoComponent,
    CreateRecipeComponent,
    FavoriteRecipesComponent,
    PersonalRecipesComponent,
    ReviewsRecipesComponent,
  ],
  imports: [ SharedModule,RouterModule.forChild(accountRoutes)],
})
export class AccountModule {}