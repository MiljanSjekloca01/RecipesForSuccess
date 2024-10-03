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
  }
  
}
