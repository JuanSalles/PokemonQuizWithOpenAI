import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/env/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);
  private loading = new BehaviorSubject<boolean>(false);
  
  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get isLoading(): Observable<boolean> {
    return this.loading.asObservable();
  }


  constructor(private http: HttpClient) { }

  login(nickname: string): Observable<Boolean>{
    this.loading.next(true);
    return this.http.post(`${environment['API_URL']}/login`, { nickname })
      .pipe(
        tap((response: any) => {
          localStorage.setItem('quizToken', response.token);
          this.loggedIn.next(true);
        }),
        // Retorna true após armazenar o token
        map(() => true),
        // Em caso de erro na requisição, retorna false
        catchError(() => {
          return of(false)})
      );
  }

  validateToken(): void {
    console.log('Validating token...');
    this.loading.next(true);
    const token = localStorage.getItem('quizToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    if (token) {
      this.http.get(`${environment['API_URL']}/validate`, { headers })
      .pipe(
        tap(() => {
          this.loggedIn.next(true);
          this.loading.next(false);
        }),
        catchError(() => {
          console.log('Token is invalid');
          localStorage.removeItem('quizToken');
          this.loggedIn.next(false);
          this.loading.next(false);
          return of(null);
        })
      )
      .subscribe();
    } else {
      console.log('Token dont exist');
      this.loggedIn.next(false);
      this.loading.next(false);
    }
  }

}
