import { Component, OnInit } from '@angular/core';
import { interval, timeout } from 'rxjs';
import { QuestionService } from '../service/service/question.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {

  public name : string='';
  public questionList : any = [];
   currentQuestion: number = 0;
   public points: number = 0;
   counter= 60;
   correctAnswer : number = 0;
   incorrectAnswer : number = 0;
   progress:string = "0";

   interval$: any; 
   isQuizCompleted : boolean = false;

  constructor(private questionService : QuestionService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem('name')!;
    this.getAllQuestions();
    this.startCounter();
  }
  getAllQuestions(){
    this.questionService.getQuestionJson()
    .subscribe(res=>{
      this.questionList = res.questions;
    })
  }

  nextQuestion(){
    this.currentQuestion++;
  }
  previousQuestion(){
    this.currentQuestion--;
  }
  answer(currentQno : number, option:any){
    
    if(currentQno === this.questionList.length){
      this.isQuizCompleted = true;
      this.startCounter();
    }
    if(option.correct){
      this.points = this.points + 10;
      this.currentQuestion++;
      this.correctAnswer++;
      setTimeout(() =>{
        this.resetCounter();      
      this.getProgressPercent();
      }, 1000);
      
    }else{
      setTimeout(() =>{
        this.currentQuestion++;
        this.incorrectAnswer++;
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);
     
      this.points = this.points - 10;
    }
  }
  startCounter(){
    this.interval$ = interval(1000)
    .subscribe(val=>{
      this.counter--;
      if(this.counter===0){
        this.currentQuestion++;
        this.counter=60;
        this.points-=10;
      }
    });
    setTimeout(() =>{
      this.interval$.unsubscribe()
    }, 600000);
  }
  stopCounter(){
    this.interval$.unsubscribe();
    this.counter=0;
  }
  resetCounter(){
    this.stopCounter();
    this.counter=60;
    this.startCounter();
  }
  resetQuiz(){
    this.resetCounter();
    this.getAllQuestions();
    this.points=0;
    this.counter=60;
    this.currentQuestion=0;
  }
  getProgressPercent(){
    this.progress = ((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress;
  }

}
