import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RecipesComponent } from "./components/page/recipes/recipes.component";
import { RecipeDetailComponent } from "./components/page/recipe-detail/recipe-detail.component";
import { AuthComponent } from "./components/page/auth/auth.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { PageTitleComponent } from "./components/partials/page-title/page-title.component";
import { AuthInterceptorService } from "./components/page/auth/auth.interceptor";
import { SwiperComponent } from './components/partials/swiper/swiper.component';
import { NutritionComponent } from './components/page/nutrition/nutrition.component';
import { NutritionDetailComponent } from './components/page/nutrition-detail/nutrition-detail.component';
import { SharedModule } from "./shared/shared.module";

@NgModule({
    declarations:[
        AppComponent,
        RecipesComponent,
        RecipeDetailComponent,
        AuthComponent,
        PageTitleComponent,
        SwiperComponent,
        NutritionComponent,
        NutritionDetailComponent,

    ],
    imports:[
        BrowserModule,
        AppRoutingModule,
        SharedModule,
        HttpClientModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers:[
        provideAnimationsAsync(),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    ],
    bootstrap: [AppComponent]
})

export class AppModule{}