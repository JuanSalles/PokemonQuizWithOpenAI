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

  selectedOption: string = '';

  constructor(private quizService: QuizService) { 

  }

  ngOnInit(): void {
    this.quizService.getQuestion().subscribe(question => {
      this.question = question;
    });
  }

  confirm(): void {
    // Aqui você pode fazer algo com a opção selecionada
    console.log(this.selectedOption);
  }
}
