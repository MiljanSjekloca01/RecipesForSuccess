import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "star-rating",
  template: `
      <div class="star-container">
          <mat-icon *ngFor="let star of [1, 2, 3, 4, 5]" 
                    [ngStyle]="{ 'color': (star <= starRating) ? filledStarColor : starColor }">
              star
          </mat-icon>
      </div>
  `,
  styles: [` .star-container { display: flex; align-items: center; }`]
})

export class StarRatingComponent implements OnInit{

    @Input()
    starRating: number = 0;

    @Input()
    filledStarColor: string = "darkred";

    @Input()
    starColor: string = "black";

    @Input()
    starRatings: number[] = [];

    ngOnInit(): void {
        if(this.starRatings.length !== 0) this.starRating = this.calculateAverageRating(this.starRatings);
        
    }

    calculateAverageRating(ratings: number[]){
        if(ratings.length === 1){
          return ratings[0];
        }
        return Math.round((ratings.reduce( (acc,current) => acc + current,0)) / ratings.length);
    }
    
}