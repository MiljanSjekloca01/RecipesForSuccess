import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'page-title',
  templateUrl: './page-title.component.html',
  styleUrl: './page-title.component.css'
})
export class PageTitleComponent implements OnChanges{

  @Input()
  title: string;

  @Input()
  aboutPage: string;

  ngOnChanges(): void {
    switch(this.title){
      case "lunch":
        this.aboutPage = "Don’t forget about lunch! We know you need tasty, easy lunches to get you through your day—whether you’re at work, school, or home. Browse pasta salads, quick soups, and sandwiches galore!"
        break;
      case "All":
        this.aboutPage = "Welcome! Explore our collection of mouthwatering recipes. Find your next favorite recipe with ease."
        break;
      case "dessert":
        this.aboutPage = "Looking for a sweet indulgence? Find your favorite dessert among our collection of recipes, perfect for satisfying sweet cravings any time of the day."
        break;
      case "drink":
        this.aboutPage = "Discover a world of flavors with our drink recipes, offering everything from wholesome smoothies to expertly mixed cocktails, perfect for any moment."
        break;
      case "dinner":
        this.aboutPage = "Explore our collection of dinner recipes designed to bring delicious flavors to your table, whether it's a quick weeknight meal or a special occasion."
        break;
      case "breakfast":
        this.aboutPage = "Start your day with our delicious breakfast recipes, ranging from quick and easy options to hearty and filling meals designed to energize and satisfy."
        break;
      case "appetizer":
        this.aboutPage = "Kick off your meal with our delectable appetizer recipes! From savory bites to delightful dips, these small plates are perfect for sharing or enjoying on your own. Elevate your gatherings with flavors that will tantalize your taste buds and set the stage for an unforgettable dining experience.";
        break;
      case "snack":
        this.aboutPage = "Craving a quick bite? Our snack recipes are here to satisfy your hunger between meals! Discover easy-to-make options, from healthy snacks to indulgent treats, that will keep your energy up and your taste buds happy. Perfect for any time of day, these snacks are designed to delight!";
        break;

      default:
        this.aboutPage = "";
        break;
    }
  }
}
