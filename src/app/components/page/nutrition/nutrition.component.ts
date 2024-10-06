import { Component, OnInit } from '@angular/core';
import { NutritionModel } from '../../../shared/models/nutrition.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ingredientsData } from '../../../shared/nutrition-data/ingredients-data';
import { vitaminsData } from '../../../shared/nutrition-data/vitamins-data';
import { mineralsData } from '../../../shared/nutrition-data/minerals-data';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrl: './nutrition.component.css'
})
export class NutritionComponent implements OnInit{
  
  currentTab: string = "vitamins";
  data: NutritionModel[] = [];

  constructor(private route: ActivatedRoute, private router: Router){
    
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentTab = params['type'] || 'vitamins';
      if(this.currentTab)
      this.loadData(this.currentTab);
    });
  }

  loadData(tab: string) {
    switch (tab) {
      case 'ingredients':
        this.data = ingredientsData;
        break;
      case 'vitamins':
        this.data = vitaminsData;
        break;
      case 'minerals':
        this.data = mineralsData;
        break;
      default:
        this.data = [];
    }
  }
}
