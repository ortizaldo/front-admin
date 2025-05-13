import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'weightPipe'
  })
  export class WeightPipe implements PipeTransform {
    transform(value: any): string {
      return `${value} kg`;
    }
  }