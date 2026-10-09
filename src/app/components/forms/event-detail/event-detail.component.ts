import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";

export interface EventoDetalle {
  _id: string;
  nombre: string;
  fechaEvento: string | Date;
  estado: "DRAFT" | "PUBLISHED" | "IN_PROGRESS" | "CANCELLED";
  arma: "1/4" | "1/2" | "1";
  numGallos: number;
  numRondas: number;
  pesoMinimo: number;
  pesoMaximo: number;
  tolerancia: number;
  creditos: number;
  totalParticipantes: number;
  totalPeleas: number;
  peleasFinalizadas: number;
  operacionIniciada: boolean;
  flyerUrl?: string | null;
}

@Component({
  selector: "app-event-detail",
  templateUrl: "./event-detail.component.html",
  styleUrls: ["./event-detail.component.scss"],
})
export class EventDetailComponent implements OnInit {
  @Input() evento!: EventoDetalle;
  @Input() data!: EventoDetalle;

  @Output() closeDetail = new EventEmitter<void>();

  @Output() startOperation = new EventEmitter<EventoDetalle>();

  @Output() cancelEvent = new EventEmitter<EventoDetalle>();
  @Output() verParticipantes = new EventEmitter<EventoDetalle>();

  constructor(
    private readonly router: Router,
    private readonly confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    if (!this.evento) {
      throw new Error("El evento es requerido");
    }
  }

  get puedeIniciarOperacion(): boolean {
    if (!this.evento) {
      return false;
    }

    return (
      this.evento.totalParticipantes > 0 &&
      this.evento.numRondas > 0 &&
      this.evento.totalPeleas > 0 &&
      this.evento.estado !== "CANCELLED"
    );
  }

  getArmaLabel(arma: EventoDetalle["arma"]): string {
    const labels: Record<EventoDetalle["arma"], string> = {
      "1/4": "1/4 de filo",
      "1/2": "1/2 de filo",
      "1": "1 pulgada",
    };

    return labels[arma] ?? arma;
  }

  getStatusLabel(estado: EventoDetalle["estado"]): string {
    const labels: Record<EventoDetalle["estado"], string> = {
      DRAFT: "BORRADOR",
      PUBLISHED: "PUBLICADO",
      IN_PROGRESS: "EN CURSO",
      CANCELLED: "CANCELADO",
    };

    return labels[estado] ?? estado;
  }

  getStatusSeverity(
    estado: EventoDetalle["estado"],
  ): "success" | "info" | "warning" | "danger" | "secondary" {
    const severities: Record<
      EventoDetalle["estado"],
      "success" | "info" | "warning" | "danger" | "secondary"
    > = {
      DRAFT: "secondary",
      PUBLISHED: "info",
      IN_PROGRESS: "success",
      CANCELLED: "danger",
    };

    return severities[estado] ?? "secondary";
  }

  cerrar(): void {
    this.closeDetail.emit();
  }

  administrarParticipantes(): void {
    // this.router.navigate(["/admin/eventos", this.evento._id, "participantes"]);
  }

  administrarRondas(): void {
    this.router.navigate(["/admin/eventos", this.evento._id, "rondas"]);
  }

  administrarPeleas(): void {
    this.router.navigate(["/admin/eventos", this.evento._id, "peleas"]);
  }

  confirmarInicioOperacion(): void {
    this.confirmationService.confirm({
      header: "Iniciar operación",
      message:
        "¿Deseas iniciar la operación de este evento? Después podrás registrar los resultados pelea por pelea.",
      icon: "pi pi-play-circle",
      acceptLabel: "Sí, iniciar",
      rejectLabel: "Cancelar",
      acceptButtonStyleClass: "p-button-danger",
      rejectButtonStyleClass: "p-button-text p-button-secondary",
      accept: () => {
        this.startOperation.emit(this.evento);
      },
    });
  }

  continuarOperacion(): void {
    this.router.navigate(["/admin/eventos", this.evento._id, "operacion"]);
  }

  editarEvento(): void {
    this.router.navigate(["/admin/eventos", this.evento._id, "editar"]);
  }

  showParticipantes(): void {
    console.log(
      "🚀 ~ EventDetailComponent ~ showParticipantes ~ this.evento:",
      this.evento,
    );
    this.verParticipantes.emit(this.evento);
  }

  confirmarCancelacion(): void {
    this.confirmationService.confirm({
      header: "Cancelar evento",
      message:
        "¿Estás seguro de cancelar este evento? Esta acción afectará su operación.",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Cancelar evento",
      rejectLabel: "Regresar",
      acceptButtonStyleClass: "p-button-danger",
      rejectButtonStyleClass: "p-button-text p-button-secondary",
      accept: () => {
        this.cancelEvent.emit(this.evento);
      },
    });
  }
}
