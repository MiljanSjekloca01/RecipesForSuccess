import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecipesComponent } from "./components/page/recipes/recipes.component";
import { RecipeDetailComponent } from "./components/page/recipe-detail/recipe-detail.component";
import { AuthComponent } from "./components/page/auth/auth.component";
import { RecipesDataResolver } from "./components/page/recipes/recipes.resolver";
import { AuthGuard } from "./components/page/auth/auth.guard";
import { AccountComponent } from "./components/page/account/account.component";
import { CreateRecipeComponent } from "./components/partials/account-partials/create-recipe/create-recipe.component";
import { PersonalInfoComponent } from "./components/partials/account-partials/personal-info/personal-info.component";
import { FavoriteRecipesComponent } from "./components/partials/account-partials/favorite-recipes/favorite-recipes.component";
import { PersonalRecipesComponent } from "./components/partials/account-partials/personal-recipes/personal-recipes.component";
import { ReviewsRecipesComponent } from "./components/partials/account-partials/reviews-recipes/reviews-recipes.component";


const routes: Routes = [
    {path: "",component: RecipesComponent,resolve: {RecipesDataResolver}},
    {path: "tag/:tag",component: RecipesComponent,resolve: {RecipesDataResolver}},
    {path: "search/:search",component: RecipesComponent,resolve: {RecipesDataResolver}},
    {path: "recipe/:id",component: RecipeDetailComponent,resolve: {RecipesDataResolver}},

    {path: "auth/login",component: AuthComponent},
    {path: "auth/register",component: AuthComponent},

    {path: "account",canActivate:[AuthGuard],component: AccountComponent, children: [
        { path: "", redirectTo:"profile"},
        { path: "profile",component: PersonalInfoComponent},
        { path: "create-recipe",component: CreateRecipeComponent},
        { path: "favorite-recipes", component: FavoriteRecipesComponent},
        { path: "personal-recipes", component: PersonalRecipesComponent},
        { path: "reviews-recipes", component: ReviewsRecipesComponent}  
    ]},
    
    {path: "**",component: RecipesComponent},
]

@NgModule({
    imports:[RouterModule.forRoot(routes,{ scrollPositionRestoration: 'top' })],
    exports:[RouterModule]
})


export class AppRoutingModule{}