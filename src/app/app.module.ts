import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { HeaderComponent } from "./components/partials/header/header.component";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AngularMaterialModule } from "./angular-material.module";
import { RecipesComponent } from "./components/page/recipes/recipes.component";
import { FormsModule } from "@angular/forms";
import { SearchBarComponent } from "./components/partials/searchBar/searchBar.component";
import { NotFoundComponent } from "./components/partials/not-found/not-found.component";
import { RecipeDetailComponent } from "./components/page/recipe-detail/recipe-detail.component";
import { AuthComponent } from "./components/page/auth/auth.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { StarRatingComponent } from "./components/partials/star-rating/star-rating.component";
import { FooterComponent } from "./components/partials/footer/footer.component";
import { PageTitleComponent } from "./components/partials/page-title/page-title.component";
import { AuthInterceptorService } from "./components/page/auth/auth.interceptor";
import { AccountComponent } from "./components/page/account/account.component";
import { CreateRecipeComponent } from "./components/page/create-recipe/create-recipe.component";

@NgModule({
    declarations:[
        AppComponent,
        HeaderComponent,
        RecipesComponent,
        SearchBarComponent,
        NotFoundComponent,
        RecipeDetailComponent,
        AuthComponent,
        StarRatingComponent,
        FooterComponent,
        PageTitleComponent,
        AccountComponent,
        CreateRecipeComponent

    ],
    imports:[
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        AngularMaterialModule,
        HttpClientModule
    ],
    providers:[
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    
  ],
    bootstrap: [AppComponent]
})

export class AppModule{}