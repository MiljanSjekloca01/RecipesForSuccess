import { Component, HostBinding, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

  constructor(private router: Router){}

  @HostBinding('class.is-visible')
  get isVisible() {
    return this.visible;
  }

  @Input()
  imageUrl: string = "assets/nothing-found/no_recipes_found.png"
  
  @Input()
  title: string = "Sorry, but we can't find the recipe you're looking for!";

  @Input()
  visible: boolean = false;

  @Input()
  buttonLabel: string = "Back to recipes";

  @Input()
  showArrow: boolean = true;

  navigateBack(){
    this.router.navigate(["../"])
  }

}
