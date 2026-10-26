import { Component, EventEmitter, HostListener, Input, Output } from "@angular/core";

@Component({
  selector: "app-confirmation-modal",
  templateUrl: "./confirmation-modal.component.html",
  styleUrl: "./confirmation-modal.component.css"
})
export class ConfirmationModalComponent {
  @Input() visible = false;
  @Input() title = "Are you sure?";
  @Input() message = "";
  @Input() confirmLabel = "Confirm";
  @Input() cancelLabel = "Cancel";

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  @HostListener("document:keydown.escape")
  onEscape() {
    if (this.visible) this.onCancel();
  }

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
