
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FooterComponent } from "../components/partials/footer/footer.component";
import { HeaderComponent } from "../components/partials/header/header.component";
import { NotFoundComponent } from "../components/partials/not-found/not-found.component";
import { SearchBarComponent } from "../components/partials/searchBar/searchBar.component";
import { StarRatingComponent } from "../components/partials/star-rating/star-rating.component";
import { TooltipComponent } from "./tooltip/tooltip.component";
import { ConfirmationModalComponent } from "./confirmation-modal/confirmation-modal.component";
import { CommonModule } from "@angular/common";
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from "@angular/router";
import { SrcWithFallbackDirective } from "./src-with-fallback.directive";
import { MaxLengthDirective } from "./max-length.directive";
import { LucideAtom, LucideCakeSlice, LucideChefHat, LucideCookie, LucideCookingPot, LucideCupSoda, LucideHeart, LucideLeaf, LucideLogIn, LucideLogOut, LucidePill, LucideSalad, LucideSprout, LucideSunrise, LucideUser, LucideUtensils } from "@lucide/angular";

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    NotFoundComponent,
    StarRatingComponent,
    TooltipComponent,
    ConfirmationModalComponent,
    SearchBarComponent,
    SrcWithFallbackDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    RouterModule,
    MaxLengthDirective,
    LucideAtom,
    LucideCakeSlice,
    LucideChefHat,
    LucideCookie,
    LucideCookingPot,
    LucideCupSoda,
    LucideHeart,
    LucideLeaf,
    LucideLogIn,
    LucideLogOut,
    LucidePill,
    LucideSalad,
    LucideSprout,
    LucideSunrise,
    LucideUser,
    LucideUtensils,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    NotFoundComponent,
    StarRatingComponent,
    TooltipComponent,
    ConfirmationModalComponent,
    SearchBarComponent,
    CommonModule,
    FormsModule,
    MatIconModule,
    SrcWithFallbackDirective,
    MaxLengthDirective,
  ],
})
export class SharedModule {}