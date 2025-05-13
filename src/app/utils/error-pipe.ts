import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";
@Pipe({
    name: 'errorPipe'
  })
  export class ErrorPipe implements PipeTransform {
    transform(key: any, error): boolean {
      // console.log("🚀 ~ ErrorPipe ~ transform ~ data:", data)
      console.log("🚀 ~ ErrorPipe ~ transform ~ error:", error)
      if (error.control == key) {
        return true;
      }else{
        return false;
      }
    }
  }