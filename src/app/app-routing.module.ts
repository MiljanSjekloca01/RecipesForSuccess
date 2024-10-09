import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecipesComponent } from "./components/page/recipes/recipes.component";
import { RecipeDetailComponent } from "./components/page/recipe-detail/recipe-detail.component";
import { AuthComponent } from "./components/page/auth/auth.component";
import { RecipesDataResolver } from "./components/page/recipes/recipes.resolver";
import { AuthGuard } from "./components/page/auth/auth.guard";
import { NutritionComponent } from "./components/page/nutrition/nutrition.component";
import { NutritionDetailComponent } from "./components/page/nutrition-detail/nutrition-detail.component";


const routes: Routes = [
    {path: "",component: RecipesComponent,resolve: {RecipesDataResolver}},
    {path: "tag/:tag",component: RecipesComponent,resolve: {RecipesDataResolver}},
    {path: "search/:search",component: RecipesComponent,resolve: {RecipesDataResolver}},
    {path: "recipe/:id",component: RecipeDetailComponent,resolve: {RecipesDataResolver}},

    {path: "auth/login",component: AuthComponent, canActivate: [AuthGuard]},
    {path: "auth/register",component: AuthComponent, canActivate: [AuthGuard]},

    {
        path: 'account',
        loadChildren: () =>
          import('./components/page/account/account.module').then((m) => m.AccountModule),
        canActivate: [AuthGuard],
      },

    {path: "nutrition",component: NutritionComponent},
    {path:"nutrition/:type",component: NutritionComponent},
    {path:"nutrition/:type/details/:name",component: NutritionDetailComponent},
    
    {path: "**",component: RecipesComponent},
]

@NgModule({
    imports:[RouterModule.forRoot(routes,{ scrollPositionRestoration: 'top' })],
    exports:[RouterModule]
})


export class AppRoutingModule{}