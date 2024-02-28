import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/enviroment';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient) { }

  getQuestion(language: string): Observable<any> {
    const token = localStorage.getItem('quizToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${environment['API_URL']}/question?language=${language}`, { headers });
  }

  postAnswer(answer: number): Observable<any> {
    const token = localStorage.getItem('quizToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${environment['API_URL']}/answer`, { answer }, { headers });
  }

  getScore(): Observable<any> {
    const token = localStorage.getItem('quizToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get('/api/score', { headers });
  }
}
