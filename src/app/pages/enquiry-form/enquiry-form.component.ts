import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHeaderComponent } from 'src/app/layout/auth-header/auth-header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VALIDATE } from 'src/app/core/constant/validate';
import { FieldValidationMessageComponent } from 'src/app/shared/field-validation-message/field-validation-message.component';
import { HelperService } from 'src/app/core/services/helper';
import { CONSTANTS, ClassType, GenderType, ModeType, OfflineTestDateType, StreamType, SubjectGroupType, TestCenterType } from 'src/app/core/constant/constant';
import { ApiService } from '@core/services/api.service';
import { AlertService } from '@core/services/alert.service';
import { DashboardHeaderComponent } from '@layout/dashboard-header/dashboard-header.component';
import { ExamTitleComponent } from '@shared/exam-title/exam-title.component';
import { CustomHeaderComponent } from '@layout/custom-header/custom-header.component';

@Component({
    selector: 'org-enquiry-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FieldValidationMessageComponent, AuthHeaderComponent, DashboardHeaderComponent, ExamTitleComponent, CustomHeaderComponent],
    templateUrl: './enquiry-form.component.html',
    styleUrls: ['./enquiry-form.component.scss'],
})
export class EnquiryFormComponent implements OnInit {
    constructor(private alertService: AlertService, private apiService: ApiService, private helperService: HelperService, private router: Router, private route: ActivatedRoute) {

    }
    tForm!: FormGroup;
    data = [] as any;
    filteredData = [] as any;
    loading = false;
    genderOptions = ["Male", "Female", "Other"] as Array<GenderType>;
    lastClassOptions = ["10", "11", "12"] as Array<ClassType>;    // also include "9" for jeet
    modeOptions = ["offline"] as Array<ModeType>;   // modeOptions = ["online", "offline"] as Array<ModeType>;  for jeet
    subjectOptions = ["PCB", "PCM"] as Array<SubjectGroupType>;
    streamOptions = ["NEET", "JEE"] as Array<StreamType>;
    dataOptions = ["Academic Magzines", "Blogs", "Ex-Aayam Students", "Facebook Ads", "FM Radio", "Friends/Relative", "Google Ads", "Hoardings", "Internet", "News Paper", "Online News Articles", "Youtube Ads", "Other"];
    margdarshakOptions = []


    // referredBy = '' as string;
    showVerifyBtn = false;
    showRegisteredNow = false;
    testCenterId!: string;
    showMessage: boolean = false;
    showOtpBtn: boolean = true;
    showResendBtn: boolean = false;

    showRegistrationForm: boolean = true;


    ngOnInit(): void {
        this.getAllMargdarshaks();


        this.tForm = new FormGroup({
            mobile_no: new FormControl(null, [
                Validators.required,
                Validators.minLength(VALIDATE.MOBILE_NO_MAX_LENGTH),
                Validators.pattern('[0-9]{10}')
            ]),
            first_name: new FormControl(null, [
                Validators.required,
            ]),
            last_name: new FormControl(null, [
                Validators.required,
            ]),
            gender: new FormControl(null, [
                Validators.required,
            ]),
            stream: new FormControl(null, [
                Validators.required,
            ]),
            lastClass: new FormControl(null, [
                Validators.required,
            ]),
            subject: new FormControl(null),

            mode: new FormControl('offline', [
                Validators.required,
            ]),

            how_do_you_come_to_know: new FormControl(null, [
                Validators.required,
            ]),
            verify_otp: new FormControl(null

            ),
            margdarshak: new FormControl("None",[
                Validators.required,
            ])
        });
    }

    onSubmit() {
        if (this.tForm.invalid) {
            this.tForm.markAllAsTouched();
        } else {
            this.registerNow()
        }
    }

    sendConfirmation(mobileNo: any, firstName: string) {
        this.apiService
            .sendWpMsg(mobileNo, firstName)
            .subscribe({
                next: (res) => {
                    this.alertService.success("Message sent successfully.");
                    this.loading = false;
                },
                error: (err) => {
                    this.alertService.error(err.message);
                    this.loading = false;
                }
            })
    }

    registerNow() {
        const mobileNo = this.tForm.value.mobile_no;
        const firstName = this.tForm.value.first_name;
        const lastName = this.tForm.value.last_name;
        const gender = this.tForm.value.gender;
        const prevClass = this.tForm.value.lastClass;  // Course as Last class field was not in thte api payload
        const stream = this.tForm.value.stream;
        const margdarshak = this.tForm.value.margdarshak;
        const tVal = this.tForm.value;
        // let lastClassVal = tVal.lastClass ;
        // if (tVal.lastClass === '11' || tVal.lastClass === '12')
        //     lastClassVal = tVal.lastClass + '-' + tVal.subject;

        // const Mode = this.tForm.value.mode;
        const howDoYouComeToKnow = this.tForm.value.how_do_you_come_to_know
        const payload = { mobileNo, firstName, lastName, gender, stream, prevClass, howDoYouComeToKnow,margdarshak };
        this.apiService
            .enquiryApi(payload)  // if want to send otp by text sms
            .subscribe({
                next: (res) => {
                    this.sendConfirmation(mobileNo, firstName )
                    this.loading = false;
                    this.alertService.success(res.message);
                    this.showMessage = true;
                },
                error: (err) => {
                    console.log("err",err)
                    this.alertService.error(err.error.message);
                    this.loading = false;
                }
            })
    }

    changeLastClass() {
        const lastClass = this.tForm.get('lastClass')?.value;
        // if (lastClass === '11' || lastClass === '12') {
        //     this.tForm.get('subject')?.addValidators(Validators.required);
        // } else {
        //     this.tForm.get('subject')?.clearValidators();
        // }
        // this.tForm.get('subject')?.updateValueAndValidity();
    }

    changeStream() {
        const mode = this.tForm.get('stream')?.value;
    }

    changeMargdarshak() {
        const mode = this.tForm.get('margdarshak')?.value;
    }

    changeMode() {
        const mode = this.tForm.get('mode')?.value;

    }

    howDoYouComeToKnow() {
        const howDoYouComeToKnow = this.tForm.get('howDoYouComeToKnow')?.value;
    }

    showEnquiryForm() :void {
        window.location.reload();
    }


    getAllMargdarshaks() {
        this.loading = true;
        this.apiService
          .getAllMargdarshakss()
          .subscribe({
            next: (res) => {
              this.data = res;
              this.filteredData = res;
              this.loading = false;
            },
            error: (err) => {
              this.alertService.error(err.message);
              this.loading = false;
            }
          });
      }

}
