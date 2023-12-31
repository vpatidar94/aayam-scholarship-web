import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class HelperService {
  constructor(private router: Router) { }
  userType: string = '';
  getAccessToken(): string {
    const token: string = sessionStorage.getItem("token") ?? "";
    return token;
  }

  setUserContactDetails(mobileNo: string) {
    localStorage.setItem("userDetail", JSON.stringify({ mobileNo: mobileNo }));
  }

  setUserDetails(name: string, stream: string) {
    const userDetail = this.getUserDetails();
    if (userDetail) {
      localStorage.setItem("userDetail", JSON.stringify({ ...userDetail, name: name, stream: stream }));
      return true
    }
    this.router.navigate(['/login'])
    return false
  }

  setAllUserDetails(name: string, stream: string, other:any) {
    const userDetail = this.getUserDetails();
    if (userDetail) {
      localStorage.setItem("userDetail", JSON.stringify({...userDetail, ...other, name: name, stream: stream }));
      return true
    }
    this.router.navigate(['/login'])
    return false
  }

  updateUserDetails(data: any) {
    const userDetail = this.getUserDetails();
    if (userDetail) {
      localStorage.setItem("userDetail", JSON.stringify({ ...userDetail, ...data }));
      return true
    }
    this.router.navigate(['/login'])
    return false
  }

  getUserDetails() {
    if (localStorage.getItem("userDetail"))
      return JSON.parse(localStorage.getItem("userDetail") ?? '')
    return {}
  }

  getUserType() {
    const userDetail = this.getUserDetails();
    if (!!userDetail?.type) {
      return userDetail?.type;
    }
    return ''
  }

  generateOtp() {
    const otp = Math.floor(1000 + Math.random() * 9000) + '';
    localStorage.setItem("otp", atob(otp));
    return otp;
  }

  setOtp(otp:string|number){
    if(otp)
     localStorage.setItem("otp", otp+'');
  }

  // isOtpAvailable() {
  //   if (!localStorage.getItem("otp"))
  //     this.router.navigate(['/login'])
  // }

  matchOtp(otp: string) {
    const localOtp = localStorage.getItem("otp") ?? '';
    return btoa(localOtp) === otp ? true : false
  }

}
