import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment.development';
import {
  register as registerSwiperElements
} from "swiper/element/bundle"


if(environment.production){
  enableProdMode();
}

registerSwiperElements();
platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));