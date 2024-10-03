import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
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
import { CreateRecipeComponent } from "./components/partials/account-partials/create-recipe/create-recipe.component";
import { PersonalInfoComponent } from "./components/partials/account-partials/personal-info/personal-info.component";
import { FavoriteRecipesComponent } from './components/partials/account-partials/favorite-recipes/favorite-recipes.component';
import { PersonalRecipesComponent } from './components/partials/account-partials/personal-recipes/personal-recipes.component';
import { ReviewsRecipesComponent } from './components/partials/account-partials/reviews-recipes/reviews-recipes.component';
import { SwiperComponent } from './components/partials/swiper/swiper.component';

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
        CreateRecipeComponent,
        PersonalInfoComponent,
        FavoriteRecipesComponent,
        PersonalRecipesComponent,
        ReviewsRecipesComponent,
        SwiperComponent

    ],
    imports:[
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        AngularMaterialModule,
        HttpClientModule,
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA],
    providers:[
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    
  ],
    bootstrap: [AppComponent]
})

export class AppModule{}