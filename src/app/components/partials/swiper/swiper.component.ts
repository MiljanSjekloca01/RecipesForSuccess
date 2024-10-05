import { AfterViewInit, Component, Input, } from '@angular/core';
import { Recipe } from '../../../shared/models/recipes.model';

@Component({
  selector: 'app-swiper',
  templateUrl: './swiper.component.html',
  styleUrl: './swiper.component.css'
})
export class SwiperComponent implements AfterViewInit{

  @Input()
  swiperRecipes: Recipe[];

  filteredRecipes: Recipe[] = [];

  dietaryPreferences: string[] = ['All','Vegetarian', 'Vegan','Gluten Free','Dairy Free'];
  activePref: string = "All";

  swiperParams = {
    slidesPerView: 1,
    breakpoints: {
      320: {
        slidesPerView: 1
      },
      700: {
        slidesPerView: 2
      },
      1050: {
        slidesPerView: 3
      },
      1400: {
        slidesPerView: 4
      },
      1750:{
        slidesPerView: 5
      },
      2100:{
        slidesPerView: 6
      }
    }
  }

  ngAfterViewInit(): void {
    const swiperEl = document.querySelector('swiper-container');
    if(swiperEl){
      Object.assign(swiperEl,this.swiperParams);
    }

    this.updateFilteredRecipes();
  }

  filterRecipes(pref: string): void{
    this.activePref = pref;
    this.updateFilteredRecipes();
  }


  private updateFilteredRecipes(): void {
    if (this.activePref === 'All') {
      this.filteredRecipes = this.swiperRecipes; // Prikaži sve recepte
    } else {
      this.filteredRecipes = this.swiperRecipes.filter(recipe => 
        recipe.dietPreference && recipe.dietPreference.includes(this.activePref)
      ); // Filtriraj na osnovu aktivne preference
    }
  }
  
}
