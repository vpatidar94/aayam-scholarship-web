import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContentHeaderComponent } from "src/app/shared/content-header/content-header.component";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/core/services/api.service";
import { AlertService } from "src/app/core/services/alert.service";
import { FieldValidationMessageComponent } from "src/app/shared/field-validation-message/field-validation-message.component";
import { ButtonType, CONSTANTS, ClassType, StreamType, SubjectNameType, ToggleType } from "src/app/core/constant/constant";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: "org-add-test",
  standalone: true,
  imports: [
    CommonModule,
    ContentHeaderComponent,
    ReactiveFormsModule,
    FieldValidationMessageComponent,
    BsDatepickerModule,
  ],
  templateUrl: "./add-test.component.html",
  styleUrls: ["./add-test.component.scss"],
})
export class AddTestComponent implements OnInit {

  constructor(private route: ActivatedRoute, private apiService: ApiService, private alertService: AlertService, private fb: FormBuilder,
    private router: Router
  ) {
    this.route.params.subscribe(params => {
      this.testId = params['testId'];
    });
  }
  loading = false;
  data = [] as any;
  testId = '';
  breadcrumbs = [
    {
      name: 'Tests',
      path: '/admin'
    },
    {
      name: this.testId ? 'Edit Test' : 'Add Test',
      path: ''
    }
  ];

  tForm!: FormGroup;
  streamOptions = ["9", "10", "11-PCM", "11-PCB", "12-PCM", "12-PCB"] as Array<ClassType>;
  toggleOptions = ['Yes', 'No'] as Array<ToggleType>;
  subjectOptions = ["PHYSICS", "CHEMISTRY", "BIOLOGY", "MATHS"] as Array<SubjectNameType>;
  questionOptions = CONSTANTS.QUESTION_OPTIONS;
  subjectNames:Array<SubjectNameType>=[];
  // isActive: boolean = false;


  ngOnInit(): void {
    const initialCheckboxValues = {} as any;
    for (const option of this.streamOptions) {
      initialCheckboxValues[option] = false;
    }
    for (const option of this.toggleOptions) {
      initialCheckboxValues[option] = false;
    }
    this.tForm = new FormGroup({
      id: new FormControl(null),
      title: new FormControl('', [
        Validators.required
      ]),
      subTitle: new FormControl('', [
      ]),
      stream: new FormControl('11', [
        Validators.required
      ]),
     
      // testDate: new FormControl(null, [
      //   Validators.required
      // ]),
      testDuration: new FormControl(7200, [
        Validators.required
      ]),
      // is12DropperSame: new FormControl('No', [
      //   Validators.required
      // ]),

      isShowTest: new FormControl('No', [
        Validators.required
      ]),
      questions: this.fb.array([]),
    });
    // this.addDefaultQuestions();
    this.getTestDetails();
    // this.changeStream();
  }
  changeToggle() {
    // const is12DropperSame = this.tForm.get('is12DropperSame')?.value;
    const showTest = this.tForm.get('isShowTest')?.value;
    // if(isShowTest=="Yes"){
    //   this.isActive = true;
    // }else {
    //   this.isActive = false;
    // }

  }
  changeStream() {
    const stream = this.tForm.get('stream')?.value;
    this.tForm.patchValue({
      subjectName: null
    });
    
    if (stream === '9' || stream === '10') {
      this.subjectNames = ["SCIENCE", "SOCIAL-SCIENCE", "MATHS"];
    } 
    else if (stream === '11-PCM' || stream === '12-PCM') {
      this.subjectNames = ["PHYSICS", "CHEMISTRY", "MATHS"];
    } 
    else {
      this.subjectNames = ["PHYSICS", "CHEMISTRY", "BIOLOGY"];
    };
    this.questions.setValue([]);
    this.addDefaultQuestions();

  }

  get questions() {
    return this.tForm.get('questions') as FormArray;
  }

  addDefaultQuestions() {
    let number = 300;
    for (var i = 0; i < number; i++) {
      console.log(i);
      if(i>=0 && i<100){
        this.addQuestion(this.subjectNames[0])
      }
      else if(i>=100 && i<200){
        this.addQuestion(this.subjectNames[1])
      }
      else{
        this.addQuestion(this.subjectNames[2])
      }
    }
  }

  addQuestion(subjectName:SubjectNameType) {
    const formGroup = this.fb.group({
      id: null,
      image: '{test-id}/Q{i}.webp',
      imageHindi: '{test-id}/Q{i}-h.webp',
      subjectName: subjectName,
      correctAnswer: new FormControl('A', [
        Validators.required,
      ]),
      type: "single-option"
    });
    this.questions.push(formGroup);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  getTestDetails() { }

  onSubmit() {
    if (this.tForm.invalid) {
      this.tForm.markAllAsTouched();
    } else {
      this.loading = true;
      const fromVal = this.tForm.value;
      // const testDate = fromVal.testDate.getDate() + '-' + (fromVal.testDate.getMonth() + 1) + '-' + fromVal.testDate.getFullYear();
      // const folderName = fromVal.id ?? (fromVal.stream + '-' + fromVal.subjectName + '-' + testDate);
      const folderName = fromVal.id ?? (fromVal.stream);


      fromVal.questions.map((x: any, index: number) => {
        x.id = index + 1;
        x.image = x.image.replace('{test-id}', folderName);
        x.image = x.image.replace('{i}', index + 1);
        x.imageHindi = x.imageHindi.replace('{test-id}', folderName);
        x.imageHindi = x.imageHindi.replace('{i}', index + 1);
      });

      const payload = {
        ...this.tForm.value,
        id: folderName,
        active: true,
        testDate: "2023-01-01",
        resultDate: "2023-01-02",
        passingScore: this.tForm.value.questions.length / 2,
        stream: this.tForm.value.stream,
        subjectNames: this.subjectNames,
      }
      this.loading = false;
      this.apiService
        .addTestDetails(payload).subscribe({
          next: () => {
            this.alertService.success('Questions added successfully.')
            this.router.navigate(['/admin']);
            this.loading = false;
          },
          error: (err) => {
            this.alertService.error(err)
            this.loading = false;
          }
        });
    }
  }
}
