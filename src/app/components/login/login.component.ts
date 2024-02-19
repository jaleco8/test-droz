import { Component } from '@angular/core';
import { AuthGoogleService } from 'src/app/services/auth-google.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private authGoogleService: AuthGoogleService) {}

  loginWithGoogle() {
    this.authGoogleService.login();
  }
}
