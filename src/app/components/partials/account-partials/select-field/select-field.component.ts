import { Component, ElementRef, HostListener, Input, NgZone, OnDestroy, ViewChild, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-select-field",
  templateUrl: "./select-field.component.html",
  styleUrl: "./select-field.component.css",
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectFieldComponent),
    multi: true
  }]
})
export class SelectFieldComponent implements ControlValueAccessor, OnDestroy {
  @Input() options: string[] = [];
  @Input() placeholder = "Select";
  @Input() inputId = "";

  @ViewChild("trigger") trigger?: ElementRef<HTMLButtonElement>;
  @ViewChild("panel") panel?: ElementRef<HTMLElement>;

  value = "";
  open = false;
  disabled = false;
  activeIndex = -1;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private reposition = () => {
    if (this.open) this.positionPanel();
  };

  constructor(private host: ElementRef<HTMLElement>, private zone: NgZone) {
    this.zone.runOutsideAngular(() => {
      document.addEventListener("scroll", this.reposition, true);
      window.addEventListener("resize", this.reposition);
    });
  }

  get listId() {
    return this.inputId ? `${this.inputId}-list` : "select-field-list";
  }

  writeValue(value: string) {
    this.value = value ?? "";
  }

  registerOnChange(fn: (value: string) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  toggle() {
    if (this.disabled) return;
    this.open = !this.open;
    if (this.open) this.activeIndex = this.options.indexOf(this.value);
    else this.onTouched();
  }

  choose(option: string) {
    this.value = option;
    this.onChange(option);
    this.close();
  }

  onKey(event: KeyboardEvent) {
    if (this.disabled) return;

    if (event.key === "Escape") {
      if (!this.open) return;
      event.preventDefault();
      event.stopPropagation();
      this.close();
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!this.open) {
        this.open = true;
        this.activeIndex = this.options.indexOf(this.value);
        return;
      }
      this.choose(this.activeIndex < 0 ? "" : this.options[this.activeIndex]);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!this.open) {
        this.open = true;
        this.activeIndex = this.options.indexOf(this.value);
      }
      this.move(event.key === "ArrowDown" ? 1 : -1);
    }
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent) {
    if (!this.open) return;
    const target = event.target as Node;
    const insideTrigger = this.host.nativeElement.contains(target);
    const insidePanel = this.panel?.nativeElement.contains(target);
    if (!insideTrigger && !insidePanel) this.close();
  }

  ngAfterViewChecked() {
    const panel = this.panel?.nativeElement;
    if (!this.open || !panel) return;
    if (panel.parentElement !== document.body) document.body.appendChild(panel);
    this.positionPanel();
  }

  ngOnDestroy() {
    document.removeEventListener("scroll", this.reposition, true);
    window.removeEventListener("resize", this.reposition);
  }

  private move(step: number) {
    const next = this.activeIndex + step;
    if (next < -1) this.activeIndex = -1;
    else if (next > this.options.length - 1) this.activeIndex = this.options.length - 1;
    else this.activeIndex = next;
  }

  private close() {
    if (!this.open) return;
    this.open = false;
    this.onTouched();
  }

  private positionPanel() {
    const trigger = this.trigger?.nativeElement;
    const panel = this.panel?.nativeElement;
    if (!trigger || !panel) return;

    const rect = trigger.getBoundingClientRect();
    const gap = 6;
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const openUp = spaceBelow < 180 && spaceAbove > spaceBelow;
    const available = openUp ? spaceAbove : spaceBelow;

    panel.style.width = `${rect.width}px`;
    panel.style.left = `${rect.left}px`;
    panel.style.maxHeight = `${Math.max(120, Math.min(280, available))}px`;

    if (openUp) {
      panel.style.top = "auto";
      panel.style.bottom = `${window.innerHeight - rect.top + gap}px`;
    } else {
      panel.style.bottom = "auto";
      panel.style.top = `${rect.bottom + gap}px`;
    }
  }
}
