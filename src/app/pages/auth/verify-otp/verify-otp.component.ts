import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHeaderComponent } from 'src/app/layout/auth-header/auth-header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HelperService } from 'src/app/core/services/helper';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CONSTANTS, UserTypeEnum } from 'src/app/core/constant/constant';
import { ApiService } from 'src/app/core/services/api.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { FieldValidationMessageComponent } from '@shared/field-validation-message/field-validation-message.component';

@Component({
  selector: 'org-verify-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AuthHeaderComponent, FieldValidationMessageComponent],
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss'],
})
export class VerifyOtpComponent implements OnInit {

  constructor(private alertService: AlertService, private helperService: HelperService, private apiService: ApiService, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.referredBy = params['referredBy'];
    });
    // this.helperService.isOtpAvailable()
  }
  tForm!: FormGroup;
  errorMessage = "";
  loading = false;
  referredBy = '' as string;

  ngOnInit(): void {
    this.tForm = new FormGroup({
      // otp_1: new FormControl(null, [
      //   Validators.required,
      //   Validators.pattern('[0-9]{1}'),
      // ]),
      // otp_2: new FormControl(null, [
      //   Validators.required,
      //   Validators.pattern('[0-9]{1}'),
      // ]),
      // otp_3: new FormControl(null, [
      //   Validators.required,
      //   Validators.pattern('[0-9]{1}'),
      // ]),
      // otp_4: new FormControl(null, [
      //   Validators.required,
      //   Validators.pattern('[0-9]{1}'),
      // ]),

      verify_otp: new FormControl(null

      ),
    });
  }

  onDigitInput(event: any) {
    let element;
    if (event.code !== 'Backspace')
      element = event.srcElement.nextElementSibling;

    if (event.code === 'Backspace')
      element = event.srcElement.previousElementSibling;

    if (element == null)
      return;
    else
      element.focus();
  }

  onSubmit() {
    if (this.tForm.invalid) {
      this.tForm.markAllAsTouched();
    }
    else {
      const otpObj = this.tForm.value
      const enteredOtp = this.tForm.value.verify_otp;
      // const newOtpVal = otpObj.otp_1 + otpObj.otp_2 + otpObj.otp_3 + otpObj.otp_4
      this.loading = true
      const user = this.helperService.getUserDetails();
      // if (user && this.helperService.matchOtp(newOtpVal)) {
      // otp verified, now send perform login/signup api call
      this.apiService
        .verifyOtp(
          user.mobileNo, enteredOtp
        ).subscribe(
          (res) => {
            console.log("ressss", res)
            if (res.status_code === 'success') {
              this.alertService.success(CONSTANTS.MESSAGES.OTP_VERIFY);
              this.loading = false;
              this.apiService.signin(user.mobileNo)
                .subscribe(
                  (res) => {
                    // if (res.status_code === 'success') {
                      this.helperService.updateUserDetails(res.user)
                      if (res.user.type === UserTypeEnum.ADMIN) {
                        this.router.navigate(['/admin']);
                        this.alertService.success(CONSTANTS.MESSAGES.LOGIN_SUCCESS);
                      }
                      else if (res.userType === UserTypeEnum.SUB_ADMIN) {
                        this.router.navigate(['/admin/organisations']);
                        this.alertService.success(CONSTANTS.MESSAGES.LOGIN_SUCCESS);
                      }
                      else if (res.isNew || !res.user.stream) {
                        this.router.navigate(['/user-detail']);
                        this.alertService.success(CONSTANTS.MESSAGES.SIGNUP_SUCCESS);
                      }
                      else {
                        this.router.navigate(['/dashboard']);
                        this.alertService.success(CONSTANTS.MESSAGES.LOGIN_SUCCESS);
                      // }
                     
                    }
                    
                  },
                  (error) => {
                    this.alertService.error(CONSTANTS.MESSAGES.SOMETHING_WRONG)
                    this.loading = false;
                  }
                );
            }
          },
          (error) => {
            this.alertService.error(CONSTANTS.MESSAGES.INVALID_OTP)
            this.loading = false;
          }
        );
    }
  }

  //Resend OTP
  resendOtp() {
    const userDetail = this.helperService.getUserDetails()
    const newOtp = this.helperService.generateOtp()

    if (userDetail?.mobileNo) {
      this.apiService.sendLoginOtp(userDetail.mobileNo)
        .subscribe(() => {
          this.helperService.setUserContactDetails(userDetail.mobileNo)
          this.router.navigate(['/verify'])
          this.alertService.success(CONSTANTS.MESSAGES.OTP_SENT)
          this.loading = false;
        }, err => {
          this.helperService.setUserContactDetails(userDetail.mobileNo)
          this.router.navigate(['/verify'])
          this.alertService.success(CONSTANTS.MESSAGES.OTP_SENT)
          this.loading = false;
        })
    }
  }
}
