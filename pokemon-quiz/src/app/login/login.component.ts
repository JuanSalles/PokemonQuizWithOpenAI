import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  nickname: string = "";

  constructor(private authService: AuthService) {}

  login(): void {
    this.authService.login(this.nickname).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        console.log("Login bem-sucedido");
      } else {
        console.log("Falha no login");
      }
    });
    console.log("entrou no login")
  }
}
