import { Injectable } from "@angular/core";

export type AlertType = "warning" | "error" | "info" | "success";

@Injectable({providedIn:"root"})
export class AlertService {
    message = "";
    type: AlertType = "info";
    visible = false;
    private timer?: ReturnType<typeof setTimeout>;

    show(message: string, type: AlertType) {
        this.message = message;
        this.type = type;
        this.visible = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.visible = false, 5000);
    }
}
