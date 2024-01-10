import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from 'src/app/layout/dashboard-header/dashboard-header.component';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { CONSTANTS } from 'src/app/core/constant/constant';
import { HelperService } from 'src/app/core/services/helper';
import { environment } from 'src/app/environments/environment.development';
import html2canvas from 'html2canvas';
// import { NgxBarcode6Module } from 'ngx-barcode6';
import JsBarcode from 'jsbarcode';


interface ansKeyFile {
  '9': string;
  '10': string;
  '11-PCB': string;
  '11-PCM': string;
  '12-PCB': string;
  '12-PCM': string;
}

@Component({
  selector: 'org-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardHeaderComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private apiService: ApiService, private alertService: AlertService, private helperService: HelperService) {
    this.bucketUrl = environment.BUCKET_URL;
  }
  @ViewChild('admitCardContainer') admitCardContainer!: ElementRef;
  bucketUrl = '';
  data: any = [];
  scoreReferral = {
    testsPoints: 0,
    userReferralPoints: 0,
    tests: [] as any
  }
  loading = false as boolean;
  scoreLoading = false as boolean;
  totalPoints = 0 as number;
  trophyCount = 0 as number;
  isExpandedPoints = false as boolean;
  isUpdateProfile = false as boolean;
  showAdmitCardDetails: boolean = false;
  showButton: boolean = false;
  barcodeValue: string = '';
  

  // NEW RELATED TO SHOW DATA ON PARTICULAR DATE
  apiResponseDate!: string; // assuming the date format is "DD-MM-YYYY"
  currentDate!: Date;

  subjectCounts: any;

  ngOnInit(): void {
    // this.apiResponseDate = "06-01-2024";
    this.currentDate = new Date();
    this.getDashboardDetails();
  }

  getDashboardDetails() {
    this.loading = true;
    this.apiService
      .getUserById()
      .subscribe(
        (res) => {
          if (res.status_code === 'success') {
            this.data = res;
            this.loading = false;
            this.barcodeValue = res.data.enrollmentNo;
            this.generateBarcode();
            this.subjectCounts = this.data.data.result[0]?.subjectCounts ?? 0;

            this.apiResponseDate = this.data.data.testDate;
            // TO SHOW START TEST BTN ON TEST DATE AND TO ONLINE ONLY AND FOR ONE TEST ONLY
            const apiDate = new Date(
              parseInt(this.apiResponseDate.split('-')[2]),  // Year
              parseInt(this.apiResponseDate.split('-')[1]) - 1,  // Month (zero-based)
              parseInt(this.apiResponseDate.split('-')[0])   // Day
            );
            if (
              this.currentDate.toDateString() === apiDate.toDateString() &&
              res.data.mode === 'online' &&
              res.data.result.length < 1
            ) {
              // If conditions are satisfied, set showButton to true
              this.showButton = true;

            }
          }
        },
        (error) => {
          this.alertService.error(CONSTANTS.MESSAGES.SOMETHING_WRONG);
          this.loading = false;
        }
      )
  }

  updateProfile() {
    this.router.navigate(['/update-user-details'])
  }

  redirectToInstruction(stream: string) {
    this.router.navigate(['/instructions/' + stream]);
  }

  // redirectToScheduled() {
  //   this.router.navigate(['/test-schedule']);
  // }

  OnReview(testId: any) {
    this.router.navigate(["/test/" + testId + "/review"]);
  }

  downloadAdmitCard(): void {
    const element = this.admitCardContainer.nativeElement;
    // Use html2canvas to capture the content as an image
    html2canvas(element).then((canvas: any) => {
      // Convert the canvas to base64 image data
      const imageData = canvas.toDataURL('image/jpeg');

      // Create a temporary link and trigger a download
      const link = document.createElement('a');
      link.href = imageData;
      link.download = 'AdmitCard.jpg';
      link.click();
    });
  }

  getTestCenterName(testCenterId: string): string {
    // Replace this with your actual mapping logic
    switch (testCenterId) {
      case "65874cd4e197cda96785ba12":
        return 'Prestige-7';
      case '65874cdde197cda96785ba14':
        return 'Prestige-14';
      case '65874cf2e197cda96785ba16':
        return 'Annie Besant-7 ';
      case '65874cf9e197cda96785ba18':
        return 'Annie Besant-14 ';
      case '65874d04e197cda96785ba1a':
        return 'St. Arnold-7';
      case '65874d0ce197cda96785ba1c':
        return 'St. Arnold-14';
      case '65858b61511c0a359263dbd1':
        return 'new center';
      // Add more cases as needed for other test centers
      default:
        return '';
    }
  }

  getAnsKeyLink(stream: string): string {
    const ansKeyFile: ansKeyFile = {
      '9': 'File_9th244242822',
      '10': 'File_10th243945604',
      '11-PCB': 'File_11th244319754',
      '11-PCM': 'File_11th244319754',
      '12-PCB': 'File_12th244323754',
      '12-PCM': 'File_12th244323754',
    };
  
    return `https://api.aayamcareerinstitute.co.in//Uploads/Files/${(ansKeyFile as any)[stream]}.pdf`;
  }

  generateBarcode() {
    // Use jsbarcode to generate the barcode
    JsBarcode("#yourBarcodeElement", this.barcodeValue, {
      format: "CODE128",
      height: 50,
      displayValue: false
    });
  }


  // NEWLY ADDED START
  isButtonVisible(): boolean {
    // Convert API response date to Date object
    const apiDate = new Date(
      parseInt(this.apiResponseDate.split('-')[2]),  // Year
      parseInt(this.apiResponseDate.split('-')[1]) - 1,  // Month (zero-based)
      parseInt(this.apiResponseDate.split('-')[0])   // Day
    );

    // Compare current date with API response date for equality
    return this.currentDate.toDateString() === apiDate.toDateString();
  }

  // NEWLY ADDED END

  get subjectList(): string[] {
    return Object.keys(this.subjectCounts);
  }

}
