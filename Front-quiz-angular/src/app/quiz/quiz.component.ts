import { Component } from '@angular/core';
import { QuizService } from '../quiz.service';
import { Question } from '../Types/types';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent {

  question!: Question;

  selectedOption: number = 1;

  language:string = '';

  isLoading: boolean = false;

  score: number = 0;

  endGame: boolean = false;

  constructor(private quizService: QuizService) { 

  }

  ngOnInit(): void {
    // this.quizService.getQuestion().subscribe(question => {
    //   this.question = question;
    // });
  }

  getQuestion(): void {
    this.isLoading = true;
    this.quizService.getQuestion(this.language).subscribe(question => {
      this.question = question;
      this.isLoading = false;

    });
  }

  confirm(): void {
   
    console.log("Sua resposta foi:", this.question.options[this.selectedOption - 1]);
    this.quizService.postAnswer(this.selectedOption).subscribe(response => {
      this.score = response.score;
      if(response.isFinished){
        this.endGame = true;
        return;
      }
      this.getQuestion();
    })
  } 
}
