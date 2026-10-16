import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
  selector: "img[srcWithFallback]",
})
export class SrcWithFallbackDirective {
  private readonly fallbackSrc = "assets/nothing-found/no_image_available.jpg";
  private requestedSrc = "";

  constructor(private element: ElementRef<HTMLImageElement>) {}

  @Input()
  set srcWithFallback(src: string) {
    const next = src || this.fallbackSrc;
    if (next === this.requestedSrc) {
      return;
    }
    this.requestedSrc = next;
    this.element.nativeElement.src = next;
  }

  @HostListener("error")
  onError() {
    const image = this.element.nativeElement;
    if (!this.requestedSrc || image.src.includes(this.fallbackSrc)) {
      return;
    }

    image.src = this.fallbackSrc;
    image.style.objectFit = "cover";
    image.style.objectPosition = "right center";
  }
}
