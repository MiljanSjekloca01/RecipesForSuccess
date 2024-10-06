import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NutritionModel } from '../../../shared/models/nutrition.model';
import { vitaminsData } from '../../../shared/nutrition-data/vitamins-data';
import { mineralsData } from '../../../shared/nutrition-data/minerals-data';
import { ingredientsData } from '../../../shared/nutrition-data/ingredients-data';

@Component({
  selector: 'app-nutrition-detail',
  templateUrl: './nutrition-detail.component.html',
  styleUrl: './nutrition-detail.component.css'
})
export class NutritionDetailComponent implements OnInit{

  type: string;
  name: string;
  item: NutritionModel | undefined;

  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
    this.type = this.route.snapshot.paramMap.get("type");
    console.log(this.type);
    this.name = this.route.snapshot.paramMap.get("name");

    if(this.type === "vitamins"){
      this.item = vitaminsData.find(vitamin => vitamin.title === this.name);
    }else if(this.type === "minerals"){
      this.item = mineralsData.find(mineral => mineral.title === this.name);
    }else if(this.type === "ingredients"){
      this.item = ingredientsData.find(ingredient => ingredient.title === this.name);
    }else{
      this.item = undefined;
    }
  }
}
