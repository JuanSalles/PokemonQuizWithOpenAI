import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);
  
  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  constructor(private http: HttpClient) { }

  login(nickname: string): Observable<Boolean>{
    return this.http.post('/api/login', { nickname })
      .pipe(
        tap((response: any) => {
          localStorage.setItem('PokeQuizToken', response.token);
        }),
        // Retorna true após armazenar o token
        map(() => true),
        // Em caso de erro na requisição, retorna false
        catchError(() => {
          return of(false)})
      );
  }

  validateToken(): void {
    const token = localStorage.getItem('PokeQuizToken');
    if (token) {
      this.http.post('/api/validate-token', { token })
      .pipe(
        tap(() => {
          this.loggedIn.next(true);
        }),
        catchError(() => {
          localStorage.removeItem('PokeQuizToken');
          this.loggedIn.next(false);
          return of(null);
        })
      )
      .subscribe();
    } else {
      this.loggedIn.next(false);
    }
  }

}
