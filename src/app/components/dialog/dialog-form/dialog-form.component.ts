import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogFormComponent implements OnInit {
  @Input() openDialog: boolean = false;
  @Input() headerDetails: string = "";
  @Output() closeDialog: EventEmitter<any> = new EventEmitter<any>();

  constructor(private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    console.log('%cdialog-form.component.ts line:16 openDialog', 'color: #007acc;', this.openDialog);
  }

  hideDialog() {
    this.openDialog = false;
    this.closeDialog.emit({ openDialog: false });
    // this.submitted = false;
  }
}
