import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import * as _ from "underscore";
import { PrimeNGConfig, SelectItem } from "primeng/api";

@Component({
  selector: "app-event-form",
  templateUrl: "./event-form.component.html",
  styleUrls: ["./event-form.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EventFormComponent implements OnInit {
  @Input() data: any | undefined;
  @Input() eventForm: UntypedFormGroup;

  @Input() title: string = "Nuevo evento";

  files = [];

  totalSize: number = 0;

  totalSizePercent: number = 0;

  items: SelectItem[];

  eventTypes = [
    {
      name: "Derby",
      value: "DERBY",
    },
    {
      name: "Compromiso",
      value: "COMPROMISO",
    },
    {
      name: "Cuarterola",
      value: "CUARTEROLA",
    },
    {
      name: "Octerola",
      value: "OCTEROLA",
    },
    {
      name: "Decarola",
      value: "DECAROLA",
    },
  ];

  weapons = [
    {
      name: "1/4 de filo",
      value: "1/4",
    },
    {
      name: "1/2 filo",
      value: "1/2",
    },
    {
      name: "Pulgada de filo",
      value: "1",
    },
  ];

  flyerError: boolean = false;
  saving: boolean = false;
  isDragging: boolean = false;

  flyerFile: File | null = null;
  flyerPreview: string | null = null;

  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeForm: EventEmitter<any> = new EventEmitter<any>();
  @Output() publish: EventEmitter<any> = new EventEmitter<any>();
  @Output() saveDraftEM: EventEmitter<any> = new EventEmitter<any>();
  constructor(private config: PrimeNGConfig) {}

  ngOnInit() {}

  saveEvent() {
    this.saving = true;
    this.save.emit({
      form: this.eventForm.value,
      _id: this.data._id,
      data: this.data,
    });
  }

  onFlyerSelect(event: { files: File[] }): void {
    const file = event.files[0];
    if (!file) return;

    this.flyerFile = file;
    this.flyerPreview = URL.createObjectURL(file);
  }

  removeFlyer(): void {
    if (this.flyerPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(this.flyerPreview);
    }

    this.flyerFile = null;
    this.flyerPreview = null;
  }
  onDrop(event: any) {}
  onDragLeave(event: any) {}
  onDragOver(event: any) {}

  close() {
    this.closeForm.emit(true);
  }
  saveDraft() {
    this.saveDraftEM.emit({
      form: this.eventForm.value,
      _id: this.data._id,
      editing: this.data._id ? true : false,
    });
  }

  publishEvent() {
    this.data.status = "PUBLISHED";
    this.publish.emit({
      _id: this.data._id,
      data: this.data,
    });
  }

  choose(event, callback) {
    callback();
  }

  onRemoveTemplatingFile(event, file, removeFileCallback, index) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onTemplatedUpload() {
    // this.messageService.add({
    //   severity: "info",
    //   summary: "Success",
    //   detail: "File Uploaded",
    //   life: 3000,
    // });
  }

  onSelectedFiles(event) {
    this.files = event.currentFiles;
    this.files.forEach((file) => {
      this.totalSize += parseInt(this.formatSize(file.size));
    });
    this.totalSizePercent = this.totalSize / 10;
  }

  uploadEvent(callback) {
    callback();
  }

  formatSize(bytes) {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
  }
}
