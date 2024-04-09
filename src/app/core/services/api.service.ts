import { HttpClient, HttpHeaders, HttpParams, } from "@angular/common/http";

import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CONSTANTS, ClassType, ModeType, StreamType, TestCenterType, UserTypeEnum } from "../constant/constant";
import { Observable, catchError, map, retry, throwError } from "rxjs";
import { AlertService } from "./alert.service";
import { CustomHttpResponse } from "src/app/models/custom-http-response";
import { environment } from "src/app/environments/environment.development";
// import { env } from "process";
// import { environment } from "@env";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private alertService: AlertService
  ) {
    // Add the event listener for storage change
    // window.addEventListener("storage", this.handleStorageChange.bind(this));
  }

  user: any = {};

  getAccessToken(): string {
    const token: string = localStorage.getItem("token") ?? "";
    return token;
  }

  setAccessToken(value: string) {
    localStorage.setItem("token", value);
  }

  isLoggedIn(): boolean {
    const token: string = localStorage.getItem("token") ?? "";
    return !!token;
  }

  setUserDetails(user: any) {
    this.user = user
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userDetail");
    this.router.navigate([""]);
  }

  canActivate(): boolean {
    if (this.isLoggedIn()) {
      return true;
    }
    else {
      this.logout();
      return false;
    }
  }

  canUnAuthActivate(): boolean {
    if (this.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    else {
      // this.logout();
      return true;
    }
  }

  redirectToDashboard() {
    this.router.navigate(["/dashboard"]);
  }
  // REGISTRATION PURPOSE

  sendSmsOtp(mobileNo: string, testCenterId: string, mode: string): Observable<any> {
    return this.http
      .post<CustomHttpResponse<any>>(
        CONSTANTS.API.SEND_SMS_OTP,
        { mobileNo, testCenterId, mode }
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  verifyOtp(mobileNo: string, enteredOtp: string): Observable<any> {
    return this.http
      .post<CustomHttpResponse<any>>(
        CONSTANTS.API.VERIFY_OTP,
        { mobileNo, enteredOtp }
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }


  register(
    payload: {
      mobileNo: string,
      name: string,
      dob: string,
      fatherName: string,
      fatherMobileNo: string,
      stream: StreamType,
      schoolName: string,
      city: string,
      testDate: TestCenterType,
      mode: ModeType,
      testCenterId: any;
    }
  ): Observable<CustomHttpResponse<any>> {
    return this.http
      .put<CustomHttpResponse<any>>(
        CONSTANTS.API.UPDATE_REGISTERATION,
        payload
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  // admission enuiry form api 

  enquiryApi(
    payload: {
      mobileNo: string, firstName: string, lastName: string, gender: string, stream: string, prevClass: string, howDoYouComeToKnow: string
    }): Observable<CustomHttpResponse<any>> {
    return this.http
      .post<CustomHttpResponse<any>>(
        CONSTANTS.API.ADD_ENQUIRY,
        payload
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }


  // doctor-form-info-api
  doctorInfoApi(
    payload: {
      mobileNo: string, name: string, maritalStatus: string, dob:Date, doa: Date, gender: string, age: string, email: string, address: string, qualification: string, speciality: string, fellowship: string, registrationNo:string, jobPattern: string, achievements: string, awards: string, dreams: string,
    }): Observable<CustomHttpResponse<any>> {
    return this.http
      .post<CustomHttpResponse<any>>(
        CONSTANTS.API.ADD_DOCTOR,
        payload
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  // SEND enquiry welcome msg THROUGH WHATSAPP
  sendWpMsg(number: string, firstName: string): Observable<{ messaging_product: string, contacts: any, messages: any }> {
    const url = environment.WHATSAPP_URL;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('API-KEY', atob(environment.W_API_KEY));

    const payload ={
      "to": 91 + number,
      "recipient_type": "individual",
      "type": "template",
      "template": {
          "language": {
              "policy": "deterministic",
              "code": "en"
          },
          "name": "welcome",
          "components": [
              {
                  "type": "body",
                  "parameters": [
                      {
                          "type": "text",
                          "text": firstName + ''
                      },
                      {
                          "type": "text",
                          "text": "visiting"
                      }
                  ]
              },
              {
                  "type": "carousel",
                  "cards": [
                      {
                          "card_index": 0,
                          "components": [
                              {
                                  "type": "header",
                                  "parameters": [
                                      {
                                          "type": "image",
                                          "image": {
                                              "link": "https://api.aayamcareerinstitute.co.in//Uploads/Files/File_courses243621741.jpeg"
                                          }
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "card_index": 1,
                          "components": [
                              {
                                  "type": "header",
                                  "parameters": [
                                      {
                                          "type": "image",
                                          "image": {
                                              "link": "https://api.aayamcareerinstitute.co.in//Uploads/Files/File_newbatch243621975.jpeg"
                                          }
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "card_index": 2,
                          "components": [
                              {
                                  "type": "header",
                                  "parameters": [
                                      {
                                          "type": "image",
                                          "image": {
                                              "link": "https://api.aayamcareerinstitute.co.in//Uploads/Files/File_successsto243621991.jpeg"
                                          }
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "card_index": 3,
                          "components": [
                              {
                                  "type": "header",
                                  "parameters": [
                                      {
                                          "type": "image",
                                          "image": {
                                              "link": "https://api.aayamcareerinstitute.co.in//Uploads/Files/File_fee-str243621897.jpeg"
                                          }
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "card_index": 4,
                          "components": [
                              {
                                  "type": "header",
                                  "parameters": [
                                      {
                                          "type": "image",
                                          "image": {
                                              "link": "https://api.aayamcareerinstitute.co.in//Uploads/Files/File_scholarshi243621975.jpeg"
                                          }
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "card_index": 5,
                          "components": [
                              {
                                  "type": "header",
                                  "parameters": [
                                      {
                                          "type": "image",
                                          "image": {
                                              "link": "https://api.aayamcareerinstitute.co.in//Uploads/Files/File_aset243621547.jpeg"
                                          }
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "card_index": 6,
                          "components": [
                              {
                                  "type": "header",
                                  "parameters": [
                                      {
                                          "type": "image",
                                          "image": {
                                              "link": "https://api.aayamcareerinstitute.co.in//Uploads/Files/File_brochure240516303.jpg"
                                          }
                                      }
                                  ]
                              }
                          ]
                      }
                  ]
              }
          ]
      }
  }
    return this.http
      .post<{ messaging_product: string, contacts: any, messages: any }>(
        url,
        payload,
        { headers: headers }
      )
      .pipe(
        retry(1),
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
  

  // GET OFFLINE ENQUIRY USERS 
  getAllEnquiryUsers(): Observable<any> {
    return this.http
      .get<CustomHttpResponse<any>>(
        CONSTANTS.API.GET_ALL_ENQUIRY_USERS
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

  //update enquiry 
  enquiryUpdateApi(
    payload: {
      userId: string, counsellor: string, attender: string, admissionStatus: string
    }
  ): Observable<CustomHttpResponse<any>> {
    return this.http
      .put<CustomHttpResponse<any>>(
        CONSTANTS.API.UPDATE_ENQUIRY,
        payload
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }


  /* ********************END OF REGISTRATION PURPOSE*********************** */

  // FOR GENERATING SINGLE ENROLL
  generateSingleEnroll(
    userId: string,
  ): Observable<CustomHttpResponse<any>> {
    return this.http
      .put<CustomHttpResponse<any>>(
        CONSTANTS.API.SINGLE_ENROLL,
        { userId }
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }



  // FOR LOGIN PURPOSE
  sendLoginOtp(mobileNo: string): Observable<any> {
    return this.http
      .post<CustomHttpResponse<any>>(
        CONSTANTS.API.SEND_LOGIN_OTP,
        { mobileNo }
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }


  // signin(mobileNo: string): Observable<any> {
  //   return this.http
  //     .post<CustomHttpResponse<any>>(
  //       CONSTANTS.API.SIGNIN,
  //       { mobileNo }
  //     )
  //     .pipe(
  //       map((res) => {
  //         return res;
  //       })
  //     );
  // }
  /*************************************END LOGIN PURPOSE**********************************************/






  // SEND OTP THROUGH WHATSAPP
  // sendOtp(number: string, otp: string): Observable<{ messaging_product: string, contacts: any, messages: any }> {
  //   const url = environment.WHATSAPP_URL;
  //   const headers = new HttpHeaders()
  //     .set('Content-Type', 'application/json')
  //     .set('API-KEY', atob(environment.W_API_KEY));

  //   const payload = {
  //     "to": number,
  //     "recipient_type": "individual",
  //     "type": "template",
  //     "template": {
  //       "language": {
  //         "policy": "deterministic",
  //         "code": "en"
  //       },
  //       "name": "otp",
  //       "components": [
  //         {
  //           "type": "body",
  //           "parameters": [
  //             {
  //               "type": "text",
  //               "text": "OTP"
  //             },
  //             {
  //               "type": "text",
  //               "text": "Aayam Star Application login"
  //             },
  //             {
  //               "type": "text",
  //               "text": otp
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   };

  //   return this.http
  //     .post<{ messaging_product: string, contacts: any, messages: any }>(
  //       url,
  //       payload,
  //       { headers: headers }
  //     )
  //     .pipe(
  //       retry(1),
  //       map((res) => {
  //         return res;
  //       }),
  //       catchError((error) => {
  //         return throwError(() => error);
  //       })
  //     );
  // }
  // send otp through text message





  sendLoginMessage(payload: any): Observable<any> {
    return this.http
      .post<CustomHttpResponse<any>>(
        '/organisation/sendLoginMessage',
        payload
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }
  // Handle storage change events
  handleStorageChange(event: StorageEvent) {
    if (event.storageArea === localStorage) {
      // LocalStorage has changed
      switch (event.key) {
        case "token":
          if (!event.newValue) {
            // handle logout if no value found in token
            this.logout();
          }
          break;
      }
    }
  }

  // main api calling -----------------
  // ----------------------------------
  signin(
    mobileNo: string,
  ): Observable<{ token: string, user: any, isNew: boolean, userType: UserTypeEnum }> {
    const payload = {
      mobileNo: mobileNo,
    };
    return this.http
      .post<CustomHttpResponse<{ token: string, user: any, isNew: boolean, userType: UserTypeEnum }>>(
        CONSTANTS.API.SIGNIN,
        payload
      )
      .pipe(
        map((res) => {
          this.setAccessToken(res.data.token);
          return res.data;
        })
      );
  }


  // addOrgAdminUser(
  //   mobileNo: string,
  //   orgCode: string,
  // ): Observable<{ token: string, user: any, isNew: boolean }> {
  //   const payload = {
  //     mobileNo: mobileNo,
  //     orgCode: orgCode,
  //   };
  //   return this.http
  //     .put<CustomHttpResponse<{ token: string, user: any, isNew: boolean }>>(
  //       '/users/addOrgAdminUser',
  //       payload
  //     )
  //     .pipe(
  //       map((res) => {
  //         this.setAccessToken(res.data.token);
  //         return res.data;
  //       })
  //     );
  // }

  // update name api calling
  updateName(
    payload: { name: string, stream: StreamType, orgCode: string }
  ): Observable<CustomHttpResponse<any>> {
    return this.http
      .post<CustomHttpResponse<any>>(
        CONSTANTS.API.UPDATE_NAME,
        payload
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }


  getQuestions(stream: string): Observable<any> {
    return this.http
      .get<CustomHttpResponse<any>>(
        CONSTANTS.API.GET_TEST + '/' + stream
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

  getTestResultByUser(testId: string | number): Observable<any> {
    return this.http
      .get<CustomHttpResponse<any>>(
        '/result/getTestResultByUser' + '/' + testId
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

  submitResult(payload: any): Observable<any> {
    return this.http
      .post<CustomHttpResponse<any>>(
        CONSTANTS.API.SUBMIT_RESULT,
        payload
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  getDashboardDetails(): Observable<any> {
    return this.http
      .get<CustomHttpResponse<any>>(
        CONSTANTS.API.GET_DASHBOARD_DETAILS
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

  // getAllScoreAndPoints(): Observable<any> {
  //   return this.http
  //     .get<CustomHttpResponse<any>>(
  //       CONSTANTS.API.GET_ALL_SCORE_POINTS
  //     )
  //     .pipe(
  //       map((res) => {
  //         return res?.data;
  //       })
  //     );
  // }

  getAllTests(): Observable<any> {
    let params = new HttpParams();
    return this.http
      .get<CustomHttpResponse<any>>(
        CONSTANTS.API.GET_ALL_TEST
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }


  deleteTest(testId: string): Observable<any> {
    return this.http
      .delete<CustomHttpResponse<any>>(
        '/test/deleteTest'
        + '/' + testId
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

  getAllUsers(): Observable<any> {
    return this.http
      .get<CustomHttpResponse<any>>(
        '/users'
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

  getUserById(): Observable<any> {
    return this.http
      .get<CustomHttpResponse<any>>(
        CONSTANTS.API.GET_USER_BY_ID
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  getAllUsersResult(): Observable<any> {
    return this.http
      .get<CustomHttpResponse<any>>(
        CONSTANTS.API.GET_ALL_USERS
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

  generateRank(stream: string): Observable<any> {
    return this.http
      .post<CustomHttpResponse<any>>(
        CONSTANTS.API.GENERATE_RANK, stream
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

  generateRankByClass(selectedStream: any): Observable<any> {
    console.log("ss", selectedStream)
    return this.http
      .post<CustomHttpResponse<any>>(
        '/users/rank-by-class', { selectedStream }
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

  sendWpMessage(payload: any): Observable<any> {
    return this.http
      .post<CustomHttpResponse<any>>(
        CONSTANTS.API.SEND_WP_MESSAGES,
        payload
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );

  }

  sendWpMessageByClass(payload: any): Observable<any> {
    return this.http
      .post<CustomHttpResponse<any>>(
        '/users/send-rank-msg-by-class',
        payload
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );

  }

  getResultByTest(stream: string): Observable<any> {
    return this.http
      .get<CustomHttpResponse<any>>(
        CONSTANTS.API.GET_RESULT_BY_TEST + '/' + stream
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

  getResultByClass(selectedStream: string): Observable<any> {
    return this.http
      .post<CustomHttpResponse<any>>(
        '/users/result-by-class', { selectedStream }
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

  getTestDetails(stream: string | number): Observable<any> {
    return this.http
      .get<CustomHttpResponse<any>>(
        CONSTANTS.API.GET_TEST_DETAIL + '/' + stream
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

  addTestDetails(payload: any): Observable<any> {
    return this.http
      .post<CustomHttpResponse<any>>(
        CONSTANTS.API.ADD_TEST_DETAIL,
        payload
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      );
  }

  // addOrganisation(formData: any): Observable<any> {
  //   return this.http
  //     .post<CustomHttpResponse<any>>(
  //       CONSTANTS.API.ADD_ORGANISATION,
  //       formData
  //     )
  //     .pipe(
  //       map((res) => {
  //         return res?.data;
  //       })
  //     );
  // }

  // getOrganisations(): Observable<any> {
  //   return this.http
  //     .get<CustomHttpResponse<any>>(
  //       CONSTANTS.API.GET_ORGANISATIONS
  //     )
  //     .pipe(
  //       map((res) => {
  //         return res;
  //       })
  //     );
  // }

  // getOrganisationById(orgId: string | number): Observable<any> {
  //   return this.http
  //     .get<CustomHttpResponse<any>>(
  //       '/organisation/getOrganisation' + '/' + orgId
  //     )
  //     .pipe(
  //       map((res) => {
  //         return res;
  //       })
  //     );
  // }
  // updateOrganisation(orgId: string, formData: any): Observable<any> {
  //   return this.http
  //     .put<CustomHttpResponse<any>>(
  //       '/organisation/updateOrganisation' + '/' + orgId,
  //       formData
  //     )
  //     .pipe(
  //       map((res) => {
  //         return res?.data;
  //       })
  //     );
  // }

  sendScore(number: string, title: string, correct: string, score: string, totalQue: string): Observable<{ messaging_product: string, contacts: any, messages: any }> {
    const payload = {
      "to": number,
      "recipient_type": "individual",
      "type": "template",
      "template": {
        "language": {
          "policy": "deterministic",
          "code": "en"
        },
        "name": "jeet_makrs",
        "components": [
          {
            "type": "body",
            "parameters": [
              // {
              //   "type": "text",
              //   "text": title + " test"
              // },
              {
                "type": "text",
                "text": correct + ''
              },
              {
                "type": "text",
                "text": totalQue + ''
              },
              {
                "type": "text",
                "text": score + ''
              },
              {
                "type": "text",
                "text": '240'
              }
            ]
          }
        ]
      }
    };

    return this.WPMessageTemplate(payload);
  }

  WPMessageTemplate(payload: any) {
    const url = environment.WHATSAPP_URL;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('API-KEY', atob(environment.W_API_KEY));

    return this.http
      .post<{ messaging_product: string, contacts: any, messages: any }>(
        url,
        payload,
        { headers: headers }
      )
      .pipe(
        retry(1),
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

}