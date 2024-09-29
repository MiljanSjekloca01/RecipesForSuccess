import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

  constructor(private router: Router){}

  @Input()
  imageUrl: string = "https://www.pngarts.com/files/4/Sorry-Transparent-Images.png"
  
  @Input()
  title: string = "Sorry, but we can't find the recipe you're looking for!";

  @Input()
  visible: boolean = false;

  navigateBack(){
    this.router.navigate(["../"])
  }

}
