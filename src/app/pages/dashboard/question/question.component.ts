import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from 'src/app/layout/dashboard-header/dashboard-header.component';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CONSTANTS } from 'src/app/core/constant/constant';
import { AlertService } from 'src/app/core/services/alert.service';
import { TimerProgressComponent } from 'src/app/shared/timer-progress/timer-progress.component';
// import { environment } from 'src/environments/environment';
import { HelperService } from 'src/app/core/services/helper';
import { environment } from 'src/app/environments/environment.development';


// function shuffleArray(array: any[]): any[] {
//   const newArray = [...array];
//   for (let i = newArray.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
//   }
//   return newArray;
// }
function shuffleArray(array: any[]): any[] {
  if (!Array.isArray(array)) {
    throw new Error('Input is not an array');
  }

  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

@Component({
  selector: 'org-question',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DashboardHeaderComponent, TimerProgressComponent],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],

})

export class QuestionComponent implements OnInit, OnDestroy {
  selectedValue: string = '';
  constructor(private router: Router, private alertService: AlertService, private route: ActivatedRoute, private apiService: ApiService,
    private helperService: HelperService
  ) {
    document.addEventListener("visibilitychange", this.visibilityChange);
    this.bucketUrl = environment.BUCKET_URL;
  }
  bucketUrl = '';
  state$!: Observable<any>;
  questionDetails = { title: '', subTitle: '', testDuration: 0 } as any;
  options = CONSTANTS.QUESTION_OPTIONS;
  questionIndex = 0;
  questions: any = [];
  question: any = null;
  answer = ''
  result: any = {};
  loading = false;
  testId = '' as string | number;
  stream = '' as string;
  isSubmit = false;
  submitDuration = 0;
  isHindiMedium = false as boolean;
  isReview = false as boolean;
  subjects: any = []
  // sectionOneQuestions: any = [];
  // sectionTwoQuestions: any = [];
  // sectionThreeQuestions: any = [];
  // sectionRandomOneQuestions: any = [];
  // sectionRandomTwoQuestions: any = [];
  // sectionRandomThreeQuestions: any = [];
  // overallRandomQuestionsArray: any = [];
  // show dialog on visibility change
  visibilityChange() {
    if (!this.isSubmit && this.isReview) {
      if (document.visibilityState === "hidden") {
        confirm('You have not submit the test paper. Are you sure you want to leave? jjjjj')
      }
    }
  }

  // page-unload and pagehide are not working
  @HostListener('window:pagehide', ['$event'])
  async canLeavePage($event: any) {
    if (!this.isSubmit) {
      if (confirm('You have not submit the test paper. Are you sure you want to leave?')) {
        $event.preventDefault();
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  // // on page change
  async canDeactivate(): Promise<boolean> {
    if (!this.isSubmit) {
      if (confirm('You have not submit the test paper. Are you sure you want to leave?')) {
        await this.submitScore(this.questions)
        return true;
      }
      else {
        return false;
      }
    }
    return true;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // this.testId = params['testId'];
      this.stream = params['stream'];
      this.isReview = (params['mode'] === 'review')
      // this.question = this.questions[this.questionIndex] ?? null;
    });
    this.loading = true;
    if (this.isReview) {
      this.isSubmit = true;
      this.state$ = this.apiService.getTestResultByUser('11-PCM-')
      this.state$?.subscribe((x) => {
        this.questionDetails = x;
        if (this.questionDetails[0].rank === null) {
          this.router.navigate(["/dashboard"]);
        }
        this.questions = x[0].studentResponse;
        this.question = x[0].studentResponse[0] ?? null;
        this.loading = false;
        
      }, (err) => {
        this.alertService.error(err.error.error);
        this.loading = false;
      })
    }
    else {
      this.state$ = this.apiService.getQuestions(this.stream)
      this.state$.subscribe((x) => {
        console.log('see it',x);
        this.questionDetails = x;
        this.questions = x.questions;
        console.log('wue',this.questions);
        this.testId= x.id;
        console.log('tid',this.testId);
        this.question = x.questions[0] ?? null;
        this.subjects = x.subjectNames;
        this.loading = false;

        // this.sectionOneQuestions = this.questions.slice(0, 4);
        // this.sectionTwoQuestions = this.questions.slice(4, 8);
        // this.sectionThreeQuestions = this.questions.slice(8, 12);


        // this.sectionRandomOneQuestions = this.getRandomQuestions(this.sectionOneQuestions, 2);
        // console.log("random1", this.sectionRandomOneQuestions);
        // this.sectionRandomTwoQuestions = this.getRandomQuestions(this.sectionTwoQuestions, 2);
        // console.log("random2", this.sectionRandomTwoQuestions);
        // this.sectionRandomThreeQuestions = this.getRandomQuestions(this.sectionThreeQuestions, 2);
        // console.log("random3", this.sectionRandomThreeQuestions);

        // this.overallRandomQuestionsArray = [
        //   ...this.sectionRandomOneQuestions,
        //   ...this.sectionRandomTwoQuestions,
        //   ...this.sectionRandomThreeQuestions
        // ];

        // console.log("Overall Random Questions Array:", this.overallRandomQuestionsArray);

        // // NEWLY ADDED
        // // this.questions = this.getRandomQuestions(x.questions, 5); // Change 5 to the number of questions you want to display
        // // console.log('questions',this.questions);
        // this.questions = this.overallRandomQuestionsArray;
        // console.log('questions', this.questions);


        // // this.question = x.questions[0] ?? null;
        // // this.question = this.sectionRandomOneQuestions[0] ?? null;
        // this.question = this.overallRandomQuestionsArray[0] ?? null;

      }, (err) => {
        if (err.status == 452) {
          this.isSubmit = true;
          this.router.navigate(["/dashboard"]);
        }
        this.alertService.error(err.error.error);
        this.loading = false;
      })
    }
    this.setSectionColors();
  }

  onSubmit() {
    if (this.answer) {
      this.question['studentAnswer'] = this.answer;
      this.questions[this.questionIndex] = this.question;
      if ((this.questions.length - 1) > this.questionIndex) {
        this.answer = '';
        this.questionIndex++;
        this.setQuestion();

      }
      else if (this.questions.length - 1 === this.questionIndex) {
        console.log("over");
        console.log('wuestu',this.questions)
        this.submitScore(this.questions);
      }
    }
  }

  skipQuestion() {
    this.questionIndex = +this.questionIndex + 1;
    this.setQuestion();
  }

  prevQuestion() {
    this.questionIndex = +this.questionIndex - 1;
    this.setQuestion();
  }

  sendWPMessage(title: string, score: string, outOf: string) {
    const userDetail = this.helperService.getUserDetails();
    this.apiService.sendScore('91' + userDetail.mobileNo, title, score, outOf).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: () => {
        this.router.navigate(['/dashboard']);
        this.loading = false;
      }
    });
  }

  setQuestion() {
    this.question = this.questions[this.questionIndex] ?? null;

  }

  async submitScore(questions: any) {
    // const data: { id: number, answer: string }[] = [];
    // questions.forEach((element: any) => {
    //   data.push({
    //     id: element.id,
    //     answer: element.studentAnswer ?? '',
    //   })
    // });
    const payload = {
      testId: this.testId,
      questions: questions,
      duration: this.submitDuration
    }
    const newPayload = JSON.parse(JSON.stringify(payload))
    this.loading = true;
    console.log("pay",payload);
    await this.apiService
      .submitResult(
        payload
      ).subscribe({
        next: (res) => {
          if (res.status_code === 'success') {
            this.result = res.data;
            this.isSubmit = true;
            this.sendWPMessage(this.questionDetails.title, this.result.score + '', this.questions.length + '');
          }
          else {
            this.alertService.error('Error in submit response. Please try again!');
            this.loading = false;
          }
        },
        error: (err) => {
          this.alertService.error(err)
          this.loading = false;
        }
      })
  }

  onTimeout() {
    this.alertService.warning('Timeout!. Test will be submitted now.');
    this.submitScore(this.questions);
  }

  updateSubmitDuration(duration: number) {
    this.submitDuration = duration;
  }

  ngOnDestroy() {
    document.removeEventListener("visibilitychange", this.visibilityChange);
  }

  // // NEWLY ADDED

  // getRandomQuestions(allQuestions: any[], count: number): any[] {
  //   const shuffledQuestions = shuffleArray(allQuestions);
  //   console.log('random', shuffledQuestions);
  //   return shuffledQuestions.slice(0, count);

  // }

  setSectionColors() {
    const sections = document.querySelectorAll('.mt-4 span');
    sections.forEach((section, index) => {
      const isActive = this.questionIndex >= index * 2 && this.questionIndex <= index * 2 + 1;
      section.classList.toggle('active-section', isActive);
    });
  }

  // getsectionOneQuestions(){
  //   this.questions = this.sectionRandomOneQuestions;
  //   this.question = this.sectionRandomOneQuestions[0] ?? null;
  //   console.log(this.question)
  // }

  // getsectionTwoQuestions(){
  //   this.questions = this.sectionRandomTwoQuestions;

  //   this.question = this.sectionRandomTwoQuestions[0] ?? null;
  // }

  // getsectionThreeQuestions(){
  //   this.questions = this.sectionRandomThreeQuestions;

  //   this.question = this.sectionRandomThreeQuestions[0] ?? null;
  // }

}
