import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { AlertService } from '../../../../services/alert.service';
import { User } from '../../../../shared/models/user.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css'
})
export class PersonalInfoComponent implements OnInit{
  pressed = false;
  user!: User;
  isDataDifferent: boolean = false;
  oldData!: User;
  cuisines: string[] = ['Italian', 'Mexican', 'Chinese', 'Indian', 'French', 'Japanese', 'Mediterranean','Serbian'];
  dietaryPreferences: string[] = ['Vegetarian', 'Vegan','Gluten Free','Dairy Free','None'];

  constructor(private authService: AuthService, private alertService: AlertService){}

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      this.user = JSON.parse(JSON.stringify(user));
      this.oldData = JSON.parse(JSON.stringify(user));
    })
  }

  onSubmit(form: NgForm){
    if(form.valid && this.isDataDifferent){
      this.alertService.show("Unfortunately, Firebase Auth REST API does not support updating user data !","info");
    }
  }

  checkIfDataChanged() {
    this.isDataDifferent = (JSON.stringify(this.oldData) !== JSON.stringify(this.user));
  }

  lengthOf(value: unknown): number {
    return typeof value === "string" ? value.length : 0;
  }


}
