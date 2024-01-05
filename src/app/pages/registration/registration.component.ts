import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHeaderComponent } from 'src/app/layout/auth-header/auth-header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VALIDATE } from 'src/app/core/constant/validate';
import { FieldValidationMessageComponent } from 'src/app/shared/field-validation-message/field-validation-message.component';
import { HelperService } from 'src/app/core/services/helper';
import { CONSTANTS, ClassType, ModeType, OfflineTestDateType, SubjectGroupType, TestCenterType } from 'src/app/core/constant/constant';
import { ApiService } from '@core/services/api.service';
import { AlertService } from '@core/services/alert.service';
import { DashboardHeaderComponent } from '@layout/dashboard-header/dashboard-header.component';

@Component({
    selector: 'org-registration',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FieldValidationMessageComponent, AuthHeaderComponent, DashboardHeaderComponent],
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
    constructor(private alertService: AlertService, private apiService: ApiService, private helperService: HelperService, private router: Router, private route: ActivatedRoute) {
        this.route.queryParams.subscribe(params => {
            this.referredBy = params['referredBy'];
        });
    }
    tForm!: FormGroup;
    loading = false;
    streamOptions = ["9", "10", "11", "12"] as Array<ClassType>;
    modeOptions = ["online", "offline"] as Array<ModeType>;
    subjectOptions = ["PCB", "PCM"] as Array<SubjectGroupType>;
    testCenterOptions = ["St. Arnold's School (Lalaram Nagar Indore)", "Annie Besant School (Precanco Colony, Annapurna Road,Indore)", "Prestige Institute of Engineering(Scheme 74 Vijay nagar, Indore)"] as Array<TestCenterType>;


    offlineDateOptions = [{
        date: "7 Jan",
        value: "07-01-2024"
    },
    {
        date:
            "14 Jan",
        value: "14-01-2024"
    }] as Array<any>;


    onlineDateOptions = [
        {
            date: "7 Jan",
            value: "07-01-2024"
        },
        {
            date:
                "8 Jan",
            value: "08-01-2024"
        },
        {
            date: "9 Jan",
            value: "09-01-2024"
        },
        {
            date:
                "10 Jan",
            value: "10-01-2024"
        },
        {
            date: "11 Jan",
            value: "11-01-2024"
        },
        {
            date:
                "12 Jan",
            value: "12-01-2024"
        },
        {
            date: "13 Jan",
            value: "13-01-2024"
        },
        {
            date:
                "14 Jan",
            value: "14-01-2024"
        },
    ] as Array<any>;

    referredBy = '' as string;
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

            student_name: new FormControl(null, [
                Validators.required,
            ]),

            father_name: new FormControl(null, [
                Validators.required,
            ]),

            father_mobile_no: new FormControl(null, [
                Validators.required,
                Validators.minLength(VALIDATE.MOBILE_NO_MAX_LENGTH),
                Validators.pattern('[0-9]{10}')
            ]),

            dob: new FormControl(null),

            stream: new FormControl(null, [
                Validators.required,
            ]),
            subject: new FormControl(null),

            school_name: new FormControl(null, [
                Validators.required,
            ]),

            city_name: new FormControl(null, [
                Validators.required,
            ]),

            mode: new FormControl(null, [
                Validators.required,
            ]),

            offline_test_date: new FormControl(null),
            online_test_date: new FormControl(null),

            test_center: new FormControl(null),
            verify_otp: new FormControl(null

            ),
        });
    }

    onSubmit() {
        if (this.tForm.invalid) {
            this.tForm.markAllAsTouched();
        } else {
            this.loading = true;
            //   const newOtp = this.helperService.generateOtp();
            const mobileNo = this.tForm.value.mobile_no;
            const mode = this.tForm.value.mode;

            // let testCenterId;
            if (mode === 'online') {
                this.testCenterId = "";
            } else if (mode === 'offline') {
                if (this.tForm.value.offline_test_date === "07-01-2024" && this.tForm.value.test_center === "St. Arnold's School (Lalaram Nagar Indore)") {
                    this.testCenterId = 'arnold-7-jan'
                } else if (this.tForm.value.offline_test_date === "14-01-2024" && this.tForm.value.test_center === "St. Arnold's School (Lalaram Nagar Indore)") {
                    this.testCenterId = 'arnold-14-jan'

                }
                else if (this.tForm.value.offline_test_date === "07-01-2024" && this.tForm.value.test_center === "Annie Besant School (Precanco Colony, Annapurna Road,Indore)") {
                    this.testCenterId = 'annie-7-jan'

                }
                else if (this.tForm.value.offline_test_date === "14-01-2024" && this.tForm.value.test_center === "Annie Besant School (Precanco Colony, Annapurna Road,Indore)") {
                    this.testCenterId = 'annie-14-jan'

                }
                else if (this.tForm.value.offline_test_date === "07-01-2024" && this.tForm.value.test_center === "Prestige Institute of Engineering(Scheme 74 Vijay nagar, Indore)") {
                    this.testCenterId = 'prestige-7-jan'

                }
                else if (this.tForm.value.offline_test_date === "14-01-2024" && this.tForm.value.test_center === "Prestige Institute of Engineering(Scheme 74 Vijay nagar, Indore)") {
                    this.testCenterId = 'prestige-14-jan'

                }

            }
            this.apiService
                // .sendOtp( mobileNo, newOtp)  // uncomment if want to send otp by whatsapp
                .sendSmsOtp(mobileNo, this.testCenterId, mode)  // if want to send otp by text sms
                .subscribe(
                    (res) => {
                        if (res.status_code === 'success') {
                            this.helperService.setUserContactDetails(this.tForm.value.mobile_no);
                            // this.router.navigate(['/verify'], { queryParams: { referredBy: this.referredBy } });
                            this.alertService.success(CONSTANTS.MESSAGES.SMS_OTP_SENT);
                            this.loading = false;
                            this.showVerifyBtn = true;
                            this.showOtpBtn = false;
                            setTimeout(() => {
                                this.showResendBtn = true;
                            }, 5000);
                        }
                        if (res.code == 400) {
                            this.alertService.error(CONSTANTS.MESSAGES.TEST_CENTER_FULL)
                        }

                    },
                    (error) => {
                        // this.helperService.setUserContactDetails(this.tForm.value.mobile_no);
                        // this.router.navigate(['/verify']);
                        if (error.error.code == 403) {
                            this.alertService.error(CONSTANTS.MESSAGES.USER_EXIST)
                            this.loading = false;
                        }
                        if (error.error.code == 400) {
                            this.alertService.error(CONSTANTS.MESSAGES.TEST_CENTER_FULL)
                            this.loading = false;
                        }
                    }

                );
        }
    }

    verifyOtp() {
        const mobileNo = this.tForm.value.mobile_no;
        const enteredOtp = this.tForm.value.verify_otp;
        this.apiService
            // .sendOtp( mobileNo, newOtp)  // uncomment if want to send otp by whatsapp
            .verifyOtp(mobileNo, enteredOtp)  // if want to send otp by text sms
            .subscribe(
                (res) => {
                    if (res.status_code === 'success') {
                        // this.helperService.setUserContactDetails(this.tForm.value.mobile_no);
                        // this.router.navigate(['/verify'], { queryParams: { referredBy: this.referredBy } });
                        this.alertService.success(CONSTANTS.MESSAGES.OTP_VERIFY);
                        this.loading = false;
                        this.showVerifyBtn = false;
                        // this.showRegisteredNow = true;
                        this.registerNow();
                        this.showMessage = true;
                    }
                },
                (error) => {
                    this.alertService.error(CONSTANTS.MESSAGES.INVALID_OTP);
                    console.error("Wrong otp", error);
                    this.loading = false;
                }
            )
    }

    resendOtp() {
        if (this.tForm.invalid) {
            this.tForm.markAllAsTouched();
        } else {
            this.loading = true;
            //   const newOtp = this.helperService.generateOtp();
            const mobileNo = this.tForm.value.mobile_no;
            const mode = this.tForm.value.mode;

            // let testCenterId;
            if (mode === 'online') {
                this.testCenterId = "";
            } else if (mode === 'offline') {
                if (this.tForm.value.offline_test_date === "07-01-2024" && this.tForm.value.test_center === "St. Arnold's School (Lalaram Nagar Indore)") {
                    this.testCenterId = 'arnold-7-jan'
                } else if (this.tForm.value.offline_test_date === "14-01-2024" && this.tForm.value.test_center === "St. Arnold's School (Lalaram Nagar Indore)") {
                    this.testCenterId = 'arnold-14-jan'

                }
                else if (this.tForm.value.offline_test_date === "07-01-2024" && this.tForm.value.test_center === "Annie Besant School (Precanco Colony, Annapurna Road,Indore)") {
                    this.testCenterId = 'annie-7-jan'

                }
                else if (this.tForm.value.offline_test_date === "14-01-2024" && this.tForm.value.test_center === "Annie Besant School (Precanco Colony, Annapurna Road,Indore)") {
                    this.testCenterId = 'annie-14-jan'

                }
                else if (this.tForm.value.offline_test_date === "07-01-2024" && this.tForm.value.test_center === "Prestige Institute of Engineering(Scheme 74 Vijay nagar, Indore)") {
                    this.testCenterId = 'prestige-7-jan'

                }
                else if (this.tForm.value.offline_test_date === "14-01-2024" && this.tForm.value.test_center === "Prestige Institute of Engineering(Scheme 74 Vijay nagar, Indore)") {
                    this.testCenterId = 'prestige-14-jan'

                }

            }
            this.apiService
                // .sendOtp( mobileNo, newOtp)  // uncomment if want to send otp by whatsapp
                .sendSmsOtp(mobileNo, this.testCenterId, mode)  // if want to send otp by text sms
                .subscribe({
                    next: () => {
                        this.helperService.setUserContactDetails(this.tForm.value.mobile_no);
                        // this.router.navigate(['/verify'], { queryParams: { referredBy: this.referredBy } });
                        this.alertService.success(CONSTANTS.MESSAGES.SMS_OTP_SENT);
                        this.loading = false;
                        this.showVerifyBtn = true;
                        this.showOtpBtn = false;
                        this.showResendBtn = true;
                    },
                    error: () => {
                        // this.helperService.setUserContactDetails(this.tForm.value.mobile_no);
                        // this.router.navigate(['/verify']);
                        this.alertService.error(CONSTANTS.MESSAGES.ERROR_SENDING_MESSAGE);
                        this.loading = false;
                    }
                });
        }
    }

    registerNow() {
        const mobileNo = this.tForm.value.mobile_no;
        const name = this.tForm.value.student_name;
        const dob = this.tForm.value.dob;
        const fatherName = this.tForm.value.father_name;
        const fatherMobileNo = this.tForm.value.father_mobile_no;
        // const stream = this.tForm.value.stream;
        const tVal = this.tForm.value;
        let streamVal = tVal.stream;
        if (tVal.stream === '11' || tVal.stream === '12')
            streamVal = tVal.stream + '-' + tVal.subject;

        const schoolName = this.tForm.value.school_name;
        const city = this.tForm.value.city_name;
        // const testDate=  this.tForm.value.test_date;
        const mode = this.tForm.value.mode;
        let testDate;
        if (mode === 'offline') {
            testDate = this.tForm.value.offline_test_date;
        } else if (mode === 'online') {
            testDate = this.tForm.value.online_test_date;
        } else {
            // Handle the case where mode is neither offline nor online (optional)
            // You might want to set a default value or show an error message.
        }

        if (mode === 'online') {
            this.testCenterId = "";
        } else if (mode === 'offline') {
            if (this.tForm.value.offline_test_date === "07-01-2024" && this.tForm.value.test_center === "St. Arnold's School (Lalaram Nagar Indore)") {
                this.testCenterId = 'arnold-7-jan'
            } else if (this.tForm.value.offline_test_date === "14-01-2024" && this.tForm.value.test_center === "St. Arnold's School (Lalaram Nagar Indore)") {
                this.testCenterId = 'arnold-14-jan'

            }
            else if (this.tForm.value.offline_test_date === "07-01-2024" && this.tForm.value.test_center === "Annie Besant School (Precanco Colony, Annapurna Road,Indore)") {
                this.testCenterId = 'annie-7-jan'

            }
            else if (this.tForm.value.offline_test_date === "14-01-2024" && this.tForm.value.test_center === "Annie Besant School (Precanco Colony, Annapurna Road,Indore)") {
                this.testCenterId = 'annie-14-jan'

            }
            else if (this.tForm.value.offline_test_date === "07-01-2024" && this.tForm.value.test_center === "Prestige Institute of Engineering(Scheme 74 Vijay nagar, Indore)") {
                this.testCenterId = 'prestige-7-jan'

            }
            else if (this.tForm.value.offline_test_date === "14-01-2024" && this.tForm.value.test_center === "Prestige Institute of Engineering(Scheme 74 Vijay nagar, Indore)") {
                this.testCenterId = 'prestige-14-jan'

            }
        }

        const payload = { mobileNo, name, dob, fatherName, fatherMobileNo, stream: streamVal, schoolName, city, testDate, mode, testCenterId: this.testCenterId };
        this.apiService
            // .sendOtp( mobileNo, newOtp)  // uncomment if want to send otp by whatsapp
            .register(payload)  // if want to send otp by text sms
            .subscribe(
                (res) => {
                    if (res.status_code === 'success') {
                        const userId = res.data.user._id;
                        this.helperService.setUserContactDetails(this.tForm.value.mobile_no);
                        this.loading = false;

                        this.apiService.generateSingleEnroll(userId)
                            .subscribe({
                                next: (res) => {
                                    // this.helperService.setUserContactDetails(this.tForm.value.mobile_no);
                                    // this.router.navigate(['/verify'], { queryParams: { referredBy: this.referredBy } });
                                    // this.alertService.success(CONSTANTS.MESSAGES.SMS_OTP_SENT);
                                    // console.log('final',res)
                                    this.loading = false;
                                    //   this.showVerifyBtn = true;
                                },
                                error: () => {
                                    // this.helperService.setUserContactDetails(this.tForm.value.mobile_no);
                                    // this.router.navigate(['/verify']);
                                    this.alertService.error(CONSTANTS.MESSAGES.ERROR_SENDING_MESSAGE);
                                    this.loading = false;
                                }
                            });;
                    }
                },
                (error) => {
                    this.alertService.error(CONSTANTS.MESSAGES.ERROR_SENDING_MESSAGE);
                    this.loading = false;
                }
            )
    }

    changeStream() {
        const stream = this.tForm.get('stream')?.value;
        if (stream === '11' || stream === '12') {
            this.tForm.get('subject')?.addValidators(Validators.required);
        } else {
            this.tForm.get('subject')?.clearValidators();
        }
        this.tForm.get('subject')?.updateValueAndValidity();
    }


    changeMode() {
        const mode = this.tForm.get('mode')?.value;

    }

    changeTestCenter() {
        const test_center = this.tForm.get('test_center')?.value;
    }

    changeOfflineTestDate() {

    }

    changeOnlineTestDate() {

    }
}
