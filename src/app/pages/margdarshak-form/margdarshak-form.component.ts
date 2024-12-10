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
    selector: 'org-margdarshak-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FieldValidationMessageComponent,CustomHeaderComponent],
    templateUrl: './margdarshak-form.component.html',
    styleUrls: ['./margdarshak-form.component.scss'],
})
export class MargdarshakFormComponent implements OnInit {
    constructor(private alertService: AlertService, private apiService: ApiService, private helperService: HelperService, private router: Router, private route: ActivatedRoute) {

    }
    tForm!: FormGroup;
    loading = false;
    genderOptions = ["Male", "Female", "Other"] as Array<GenderType>;
    // jobPatternOptions = ["Govt.", "Private", "Self Employed", "Clinic or Hospital"];
    associatedByOptions = ["Rakesh Sharma", "Ankit Bijoria", "Bapu Patil", "Rahul Vyas", "Niraj Choudhary", "Piyush Patel", "Manish Patidar","Nikunj Patidar"];
    margdarshakCategoryOptions = ["Slab-1", "Slab-2", "Slab-3", "Slab-4", "Slab-5"];
    // maritalOptions = ["Married", "Unmarried"]
    // lastClassOptions = ["10", "11", "12"] as Array<ClassType>;    // also include "9" for jeet
    // modeOptions = ["offline"] as Array<ModeType>;   // modeOptions = ["online", "offline"] as Array<ModeType>;  for jeet
    // subjectOptions = ["PCB", "PCM"] as Array<SubjectGroupType>;
    // streamOptions = ["NEET", "JEE"] as Array<StreamType>;
    // dataOptions = ["Academic Magzines", "Blogs", "Ex-Aayam Students", "Facebook Ads", "FM Radio", "Friends/Relative", "Google Ads", "Hoardings", "Internet", "News Paper", "Online News Articles", "Youtube Ads", "Other"];



    // referredBy = '' as string;
    showVerifyBtn = false;
    showRegisteredNow = false;
    testCenterId!: string;
    showMessage: boolean = false;
    showOtpBtn: boolean = true;
    showResendBtn: boolean = false;

    showRegistrationForm: boolean = true;


    ngOnInit(): void {
        this.tForm = new FormGroup({
            mobile_no: new FormControl(null, [
                Validators.required,
                Validators.minLength(VALIDATE.MOBILE_NO_MAX_LENGTH),
                Validators.pattern('[0-9]{10}')
            ]),
            first_name: new FormControl(null, [
                Validators.required,
            ]),
            code: new FormControl(null, [
                Validators.required
            ]),
            dob: new FormControl(null, [
                Validators.required
            ]),
            // marital_status: new FormControl(null, [
            //     Validators.required,
            // ]),
            // doa: new FormControl(null, [
            //     Validators.required
            // ]),
            // age: new FormControl(null, [
            //     Validators.required,
            // ]),
            gender: new FormControl(null, [
                Validators.required,
            ]),
            address: new FormControl(null, [
                Validators.required,
            ]),
            city: new FormControl(null, [
                Validators.required,
            ]),
            district: new FormControl(null, [
                Validators.required,
            ]),

            email_id: new FormControl(null, [
                Validators.required,
            ]),
            occupation: new FormControl(null, [
                Validators.required,
            ]),

            org_name: new FormControl(null, [
                Validators.required,
            ]),
            margdarshak_category: new FormControl(null, [
                Validators.required,
            ]),
            account_no: new FormControl(null, [
                Validators.required,
            ]),
            ifsc_code: new FormControl(null, [
                Validators.required,
            ]),
            associated_by: new FormControl(null, [
                Validators.required,
            ]),


            // specialty: new FormControl(null),

            // super_specialty: new FormControl(null),

            // registration_number: new FormControl(null),
            
            // job_pattern: new FormControl(null, [
            //     Validators.required,
            // ]),

            // achievements: new FormControl(null),

            // awards: new FormControl(null),

            // dreams: new FormControl(null),

            // // how_do_you_come_to_know: new FormControl(null, [
            // //     Validators.required,
            // // ]),
            // verify_otp: new FormControl(null

            // ),

        });
        this.generateUniqueCode();

    }


    // ngOnInit(): void {
    //     this.generateUniqueCode();
    //   }
    
      generateUniqueCode() {
        const randomNumber = Math.floor(100 + Math.random() * 900); // Generates a number from 100 to 999
        const uniqueCode = `MAAY${randomNumber}`;
        this.tForm.get('code')?.setValue(uniqueCode);
      }


    onSubmit() {
        if (this.tForm.invalid) {
            this.tForm.markAllAsTouched();
        } else {
            this.registerNow()
        }
    }

    sendConfirmation(mobileNo: any, firstName: string) {
        // this.apiService
        //     .sendWpMsg(mobileNo, firstName)
        //     .subscribe({
        //         next: (res) => {
        //             this.alertService.success("Message sent successfully.");
        //             this.loading = false;
        //         },
        //         error: (err) => {
        //             this.alertService.error(err.message);
        //             this.loading = false;
        //         }
        //     })
        console.log("registered successfully");
    }

    registerNow() {
        const code = this.tForm.value.code;
        const mobileNo = this.tForm.value.mobile_no;
        const name = this.tForm.value.first_name;
        const dob = this.tForm.value.dob;
        // const maritalStatus = this.tForm.value.marital_status;
        // const doa = this.tForm.value.doa;
        const gender = this.tForm.value.gender;
        const address = this.tForm.value.address;
        const city = this.tForm.value.city;
        const district = this.tForm.value.district;


        // const age = this.tForm.value.age;  // Course as Last class field was not in thte api payload
        const email = this.tForm.value.email_id;
        const occupation = this.tForm.value.occupation;
        const orgName = this.tForm.value.org_name;
        const margdarshakCategory = this.tForm.value.margdarshak_category;
        const accountNo = this.tForm.value.account_no;
        const ifscCode = this.tForm.value.ifsc_code;
        const associatedBy = this.tForm.value.associated_by;


        // const speciality = this.tForm.value.specialty;
        // const fellowship = this.tForm.value.super_specialty;
        // const registrationNo = this.tForm.value.registration_number;
        // const jobPattern = this.tForm.value.job_pattern;
        // const achievements = this.tForm.value.achievements;
        // const awards = this.tForm.value.awards;
        // const dreams = this.tForm.value.dreams; 



        const tVal = this.tForm.value;
        // let lastClassVal = tVal.lastClass ;
        // if (tVal.lastClass === '11' || tVal.lastClass === '12')
        //     lastClassVal = tVal.lastClass + '-' + tVal.subject;

        // const Mode = this.tForm.value.mode;

        const payload = { code, mobileNo, name, dob, gender, address, city, district, email, occupation, orgName, margdarshakCategory, accountNo, ifscCode, associatedBy};
        this.apiService
            .margdarshakInfoApi(payload)  // if want to send otp by text sms
            .subscribe({
                next: (res) => {
                    this.sendConfirmation(mobileNo, name )
                    this.loading = false;
                    this.alertService.success(res.message);
                    this.showMessage = true;
                    console.log('payload:',payload);
                },
                error: (err) => {
                    console.log("err",err)
                    this.alertService.error(err.error.message);
                    this.loading = false;
                }
            })
    }

    // changeLastClass() {
    //     const lastClass = this.tForm.get('lastClass')?.value;
    //     // if (lastClass === '11' || lastClass === '12') {
    //     //     this.tForm.get('subject')?.addValidators(Validators.required);
    //     // } else {
    //     //     this.tForm.get('subject')?.clearValidators();
    //     // }
    //     // this.tForm.get('subject')?.updateValueAndValidity();
    // }

    // changeStream() {
    //     const mode = this.tForm.get('stream')?.value;
    // }

    changeMode() {
        const mode = this.tForm.get('mode')?.value;

    }
    // changeMaritalStatus(){
    //     const marital_status = this.tForm.get("marital_status")?.value;
    // }
    // howDoYouComeToKnow() {
    //     const howDoYouComeToKnow = this.tForm.get('howDoYouComeToKnow')?.value;
    // }

    showEnquiryForm() :void {
        window.location.reload();
    }

}
