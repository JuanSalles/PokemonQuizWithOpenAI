import { Component } from '@angular/core';
import { QuizService } from '../quiz.service';
import { Question } from '../Types/types';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
    trigger('resize', [
      state('small', style({width: '332px'})),
      state('large', style({width: '500px'})),
      transition('small <=> large', animate('0.5s ease-in-out')),
    ]),
  ],
})
export class QuizComponent {

  boxSizing: string = 'small';

  question!: Question;

  isLoading: boolean = false;

  score: number = 0;

  endGame: boolean = false;

  

  optionLanguages = [
    { value: "Java", label: "Java", imageSrc:"../../assets/iconLanguages/JAVA.png"},
    { value: "Javascript", label: "JavaScript", imageSrc:"../../assets/iconLanguages/JAVASCRIPT.png" },
    { value: "Python", label: "Python", imageSrc:"../../assets/iconLanguages/PYTHON.png" },
    { value: "Csharp", label: "C#", imageSrc:"../../assets/iconLanguages/CSHARP.png" },
    { value: "SQL", label: "SQL", imageSrc:"../../assets/iconLanguages/SQL.png"},
    { value: "Ruby", label: "Ruby", imageSrc:"../../assets/iconLanguages/RUBY.png" },
    { value: "Golang", label: "Golang", imageSrc:"../../assets/iconLanguages/GOLANG.png" },
    
  ]
  constructor(private quizService: QuizService) { 

  }

  getQuestion(language: string): void {
    this.isLoading = true;
    this.quizService.getQuestion(language).subscribe(question => {
      this.boxSizing = 'large';
      this.question = question;
      this.isLoading = false;
    });
  }

  nextQuestion(event: any): void {
    this.score = event.score;
    this.endGame = event.endGame;
    if(!this.endGame){
      this.getQuestion("");
    }
  }
}
