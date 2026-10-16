import { Component, Input, OnChanges } from '@angular/core';

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

  private readonly descriptions: Record<string, string> = {
    lunch: "Don’t forget about lunch! We know you need tasty, easy lunches to get you through your day—whether you’re at work, school, or home. Browse pasta salads, quick soups, and sandwiches galore!",
    All: "Welcome! Explore our collection of mouthwatering recipes. Find your next favorite recipe with ease.",
    dessert: "Looking for a sweet indulgence? Find your favorite dessert among our collection of recipes, perfect for satisfying sweet cravings any time of the day.",
    drink: "Discover a world of flavors with our drink recipes, offering everything from wholesome smoothies to expertly mixed cocktails, perfect for any moment.",
    dinner: "Explore our collection of dinner recipes designed to bring delicious flavors to your table, whether it's a quick weeknight meal or a special occasion.",
    breakfast: "Start your day with our delicious breakfast recipes, ranging from quick and easy options to hearty and filling meals designed to energize and satisfy.",
    appetizer: "Kick off your meal with our delectable appetizer recipes! From savory bites to delightful dips, these small plates are perfect for sharing or enjoying on your own. Elevate your gatherings with flavors that will tantalize your taste buds and set the stage for an unforgettable dining experience.",
    snack: "Craving a quick bite? Our snack recipes are here to satisfy your hunger between meals! Discover easy-to-make options, from healthy snacks to indulgent treats, that will keep your energy up and your taste buds happy. Perfect for any time of day, these snacks are designed to delight!",
    pizza: "Who doesn't love pizza? It is the cheat meal almost everyone agrees on, from a plain tomato pie to a pan full of toppings.",
    pasta: "Pasta is the weeknight trick that still feels like a real dinner. Sauce, noodles, and not much time.",
    rice: "Rice is the quiet base under half the world's dinners. One pot can be the meal, or the side that holds everything else.",
    noodles: "Noodles are for the night you want a bowl, not a project. A stir-fry or a broth, eaten with a slurp.",
    soup: "Soup is how a few ingredients become dinner. A broth, a creamy pot, or a bowl that wants a piece of bread on the side.",
    salad: "A good salad is more than leaves. Crunch, a real dressing, and enough in the bowl to count as the meal.",
    sandwich: "A sandwich is lunch you can hold. A toastie, a filled roll, or one worth making instead of buying.",
    burger: "A burger is what people order when they don't want to decide. The homemade version is that same easy yes.",
    tacos: "Tacos are a small dinner you build yourself. Fillings, salsa, and shells for the middle of the table.",
    curry: "Curry is the smell that means dinner is actually happening. Mild or hot, the sauce is usually looking for a plate of rice.",
    stew: "Stew is the pot you leave alone and then eat for two days. Slow, thick, and better tomorrow than it was tonight.",
    seafood: "Seafood is the lighter dinner that still feels like you cooked. Fish or shellfish, mostly from a hot pan or the oven.",
    chicken: "Chicken is what people cook when dinner has to be easy and still taste like something. A roast, a pan, or a saucy plate.",
    beef: "Beef is the meal you make when the plate should feel generous. A steak, mince, or a braise that takes its time.",
    sushi: "Sushi is the restaurant habit people try once at home and then keep trying. Rolls, rice, or a simpler bowl with the same idea.",
    other: "Some dishes refuse a category. A bake, a bowl, or a recipe that is not quite pizza or soup can still be worth making.",
  };

  ngOnChanges(): void {
    this.aboutPage = this.descriptions[this.title] ?? "";
  }
}
