import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { Question } from 'src/app/Types/types';
import { QuizService } from 'src/app/quiz.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})
export class QuestionComponent {
  constructor(private quizService: QuizService) { }
  @Input() question!: Question;
  score: number = 0;
  endGame: boolean = false;
  isLoading: boolean = false;
  @Output() nextQuestion = new EventEmitter<any>();
  @ViewChild(MatButtonToggleGroup) toggleGroup!: MatButtonToggleGroup;

  confirm(answer: string): void {
    this.isLoading = true;
    console.log("Sua resposta foi:", this.question.options[+answer - 1]);
    this.quizService.postAnswer(+answer).subscribe(response => {
      this.isLoading = false;
      this.score = response.score;
      if(response.isFinished){
        this.endGame = true;
      }
      this.nextQuestion.emit({score: this.score, endGame: this.endGame});
      this.toggleGroup.value = null;
    })
  } 
}
