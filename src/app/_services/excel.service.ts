import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

interface Registro {
  data: any[];
}

interface DatosCorredores {
  [nombre: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  exportToExcel(data: DatosCorredores, fileName: string): void {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]);

    let col = 0;
    for (const [corredor, registros] of Object.entries(data)) {
      // Escribir el nombre del corredor
      XLSX.utils.sheet_add_aoa(ws, [[corredor]], { origin: { r: 0, c: col } });

      // Escribir las cabeceras
      XLSX.utils.sheet_add_aoa(ws, [['Folio', 'Cantidad']], { origin: { r: 1, c: col } });

      // Escribir los registros
      registros.data.forEach((registro, index) => {
        XLSX.utils.sheet_add_aoa(ws, [[registro['folio'], registro['amount']]], { origin: { r: 2 + index, c: col } });
      });

      // Moverse a la siguiente columna
      col += 3;
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Corredores');

    // Generar el archivo Excel
    XLSX.writeFile(wb, 'corredores.xlsx');
  }

}
