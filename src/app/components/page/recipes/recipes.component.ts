import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { RecipeService } from '../../../services/recipe.service';
import { Recipe } from '../../../shared/models/recipes.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-recipes',
  templateUrl:'./recipes.component.html',
  styleUrl: './recipes.component.css',
})
export class RecipesComponent implements OnInit, AfterViewInit, OnDestroy{

  constructor(private recipeService: RecipeService,private activeRoute: ActivatedRoute,private host: ElementRef<HTMLElement>,private changeDetector: ChangeDetectorRef){}

  recipes: Recipe[] = [];
  recipesShownNumber = 10;
  private revealedCount = 0;
  private resizeObserver?: ResizeObserver;
  routeSubscription?: Subscription;
  pageTitle = "All";
  showSwiper = false;

  ngOnInit(){
    this.routeSubscription = this.activeRoute.params.subscribe( param => {
      this.revealedCount = 0;
      if(param.tag){
        this.showSwiper = false;
        this.pageTitle = param.tag
        this.recipes = this.recipeService.getRecipesByTag(param.tag)
      }else if(param.search || param.search === ""){
        this.showSwiper = false;
        this.recipes = this.recipeService.getRecipesBySearch(param.search)
        this.pageTitle = "Results for " + param.search
      }else{
        this.recipes = this.recipeService.getRecipes();
        this.showSwiper = true;
      }

      this.syncShownCount();
    })

    this.recipeService.recipeAdded.subscribe(recipe => {
      this.recipes.push(recipe);
    });

  }

  ngAfterViewInit(){
    this.resizeObserver = new ResizeObserver(() => {
      this.syncShownCount();
      this.changeDetector.detectChanges();
    });
    this.resizeObserver.observe(this.host.nativeElement);
    this.syncShownCount();
  }

  onShowMoreRecipes(){
    this.revealedCount = this.recipesShownNumber + this.columnCount();
    this.syncShownCount();
  }

  private syncShownCount(){
    const columns = this.columnCount();
    const target = Math.max(columns * 2, this.revealedCount);
    this.recipesShownNumber = Math.ceil(target / columns) * columns;
  }

  private columnCount(){
    const width = this.host.nativeElement.clientWidth;
    const grid = this.host.nativeElement.querySelector(".container");
    const measuredGap = grid ? parseFloat(getComputedStyle(grid).columnGap) : NaN;
    const gap = Number.isFinite(measuredGap) ? measuredGap : parseFloat(getComputedStyle(document.documentElement).fontSize) * 2;
    const minColumn = 300;
    if (width < minColumn) return 1;
    return Math.max(1, Math.floor((width + gap) / (minColumn + gap)));
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.routeSubscription?.unsubscribe();
  }

}
