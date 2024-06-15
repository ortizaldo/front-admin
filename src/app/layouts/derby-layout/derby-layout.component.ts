import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-derby-layout",
  templateUrl: "./derby-layout.component.html",
  styleUrls: ["./derby-layout.component.scss"]
})
export class DerbyLayoutComponent implements OnInit {
  public sidebarColor: string = "red";

  constructor() { }
  ngOnInit() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.add("white-content");
  }
}
