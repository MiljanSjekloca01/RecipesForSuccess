
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FooterComponent } from "../components/partials/footer/footer.component";
import { HeaderComponent } from "../components/partials/header/header.component";
import { NotFoundComponent } from "../components/partials/not-found/not-found.component";
import { SearchBarComponent } from "../components/partials/searchBar/searchBar.component";
import { StarRatingComponent } from "../components/partials/star-rating/star-rating.component";
import { TooltipComponent } from "./tooltip/tooltip.component";
import { CommonModule } from "@angular/common";
import {MatIconModule} from '@angular/material/icon';
import { Router, RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    NotFoundComponent,
    StarRatingComponent,
    TooltipComponent,
    SearchBarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    NotFoundComponent,
    StarRatingComponent,
    TooltipComponent,
    SearchBarComponent,
    CommonModule,
    FormsModule,
    MatIconModule
  ],
})
export class SharedModule {}