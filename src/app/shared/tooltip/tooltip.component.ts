import { Component } from "@angular/core";
import { AlertService } from "../../services/alert.service";

@Component({
  selector: "app-tooltip",
  templateUrl: "./tooltip.component.html",
  styleUrl: "./tooltip.component.css"
})
export class TooltipComponent {
  constructor(public alert: AlertService) {}
}
