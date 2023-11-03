import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/_services/auth.service";
import { TokenStorageService } from "src/app/_services/token-storage.service";
import { User } from "src/app/interfaces/user";

@Component({
  selector: "app-profile",
  templateUrl: "profile.component.html"
})
export class ProfileComponent implements OnInit {
  user: User | undefined;
  constructor(private tokenService: TokenStorageService) { }

  ngOnInit() {
    this.user = this.tokenService.getUser();
  }
}
