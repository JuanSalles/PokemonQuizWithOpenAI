import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  nickname: string = "";
  isLoading: boolean = true;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLoading.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  login(): void {
    this.authService.login(this.nickname).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        console.log("Login bem-sucedido");
      } else {
        console.log("Falha no login");
      }
    });
    console.log("Fazendo login...")
  }
}
