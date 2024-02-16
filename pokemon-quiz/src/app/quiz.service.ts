import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient) { }

  getQuestion(): Observable<any> {
    return this.http.get('/api/question');
  }

  postAnswer(answer: string): Observable<any> {
    const token = localStorage.getItem('PokeQuizToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post('/api/answer', { answer }, { headers });
  }

  getScore(): Observable<any> {
    const token = localStorage.getItem('PokeQuizToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get('/api/score', { headers });
  }
}
