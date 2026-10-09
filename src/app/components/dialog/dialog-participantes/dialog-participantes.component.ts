import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewEncapsulation,
} from "@angular/core";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-dialog-participantes",
  templateUrl: "./dialog-participantes.component.html",
  styleUrls: ["./dialog-participantes.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DialogParticipantesComponent implements OnInit {
  @Input() openDialog: boolean = false;
  @Input() headerDetails: string = "";
  @Input() size: any = { width: "450px" };
  @Input() model: any;
  @Input() title: string;

  @Output() closeDialog: EventEmitter<any> = new EventEmitter<any>();

  @Input() labelTemplate: TemplateRef<any>;

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {}

  hideDialog() {
    this.openDialog = false;
    this.closeDialog.emit({ openDialog: false });
    // this.submitted = false;
  }
}
