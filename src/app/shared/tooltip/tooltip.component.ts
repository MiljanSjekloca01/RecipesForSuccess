import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.css'
})
export class TooltipComponent{
  @Input({required: true}) message: string = '';  
  @Input({required: true}) messageType:  "warning" | "errror" | "info" | "success"

}
