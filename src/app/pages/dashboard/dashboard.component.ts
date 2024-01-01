import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from 'src/app/layout/dashboard-header/dashboard-header.component';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { CONSTANTS } from 'src/app/core/constant/constant';
import { HelperService } from 'src/app/core/services/helper';
import { environment } from 'src/app/environments/environment.development';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'org-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardHeaderComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  user = {
    "_id": "6587228b376f1ecd3446a150",
    "name": "te",
    "mobileNo": "8222222222",
    "dob": "2023-12-27",
    "fatherName": "te",
    "stream": "11-PCM",
    "schoolName": "t",
    "city": "t",
    "testDate": "07-01-2024",
    "mode": "offline",
    "testCenter": "65858b61511c0a359263dbd1",
    "__v": 0
  };

  constructor(private router: Router, private apiService: ApiService, private alertService: AlertService, private helperService: HelperService) {
    this.bucketUrl = environment.BUCKET_URL;
  }
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

  ngOnInit(): void {
    this.getDashboardDetails();
    this.getScorePoints();

  }

  getDashboardDetails() {
    this.loading = true;
    this.apiService
      .getDashboardDetails()
      .subscribe({
        next: (res) => {
          this.data = res;
          this.loading = false;
        },
        error: (err) => {
          this.alertService.error(err.message);
          this.loading = false;
        }
      });
  }

  getScorePoints() {
    // this.scoreLoading = true;
    // this.apiService
    //   .getAllScoreAndPoints()
    //   .subscribe({
    //     next: (res) => {
    //       if (res?.tests.length > 0) {
    //         this.scoreReferral.tests = res?.tests.reverse() as any;
    //         this.scoreReferral.testsPoints = res.tests.reduce((previousVal: any, currentVal: any) => {
    //           return (isNaN(previousVal) ? (previousVal?.points ?? 0) : (previousVal ?? 0)) + (currentVal.points ?? 0);
    //         });
    //       }
    //       this.scoreReferral.userReferralPoints = res?.userReferralPoints;
    //       this.totalPoints = this.scoreReferral.userReferralPoints + this.scoreReferral.testsPoints;
    //       this.trophyCount = Math.floor(this.totalPoints / 2000);
    //       this.totalPoints = this.totalPoints - this.trophyCount * 2000;
    //       this.scoreLoading = false;
    //     },
    //     error: (err) => {
    //       this.alertService.error(err.message);
    //       this.scoreLoading = false;
    //     }
    //   });
  }

  generateTrophyArray(): number[] {
    return Array.from({ length: this.trophyCount }, (_, index) => index + 1);
  }

  updateProfile() {
    this.router.navigate(['/update-user-details'])
  }

  redirectToInstruction(testId: string) {
    this.router.navigate(['/instructions/' + testId]);
  }

  redirectToScheduled() {
    this.router.navigate(['/test-schedule']);
  }

  copyToClipboard() {
    const user = this.helperService.getUserDetails();
    const text = `Register to Aayam Star, ${window.location.origin}/login?referredBy=${user._id}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.alertService.success('Referral link is copy to clipboard. Share with your friends.');
      }, (error) => {
        console.log(error)
      });
    } else {
      this.alertService.error('Browser do not support Clipboard API');
    }
  }

  async share() {
    const shareText = 'Register to Aayam Star,';
    const referralLink = this.generateReferralLink();
    const shareUrl = window.location.href;
    const imageUrl = 'https://aayamcareerinstitute.com/images/aayam-star/aayam-star-main.webp';

    try {
      // const response = await fetch(imageUrl);
      // const imageBlob = await response.blob();
      if (navigator.share) {
        await navigator.share({
          title: 'AAYAM STAR',
          text: `${shareText}\n${referralLink}`,
          // url: shareUrl,
          //  files: [new File([imageBlob,], 'aayam-star-main.webp', { type: 'image/webp'})], // Replace with your actual image data
        });
      } else {
        console.error('Web Share API not supported');
        this.alertService.error('Browser do not support Clipboard API')
        // Share via WhatsApp
        window.open(`whatsapp://send?text=${encodeURIComponent(shareText + ' ' + referralLink)}`);
      }
    }
    catch (error) {
      console.error('Error sharing:', error);
    }
  }

  generateReferralLink(): string {
    const user = this.helperService.getUserDetails();
    return `${window.location.origin}/login?referredBy=${user._id}`;
  }

  OnReview(testId: any) {
    this.router.navigate(["/test/" + testId + "/review"]);
  }

  generateAdmitCardPDF() {
    const pdf = new jsPDF();

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.text('Admit Card', 105, 20, { align: 'center' });

    // Add a border for the Admit Card
    pdf.setLineWidth(0.5);
    pdf.rect(10, 30, 190, 240);

    // Define user details as an array of objects
    const userDetailsData = [
      { label: 'Roll Number', value: '3869' },
      { label: 'Candidate\'s Name', value: 'Anil Das' },
      { label: 'Father\'s Name', value: 'Satyanarayan Das' },
      { label: 'Class', value: '12th(PCM)' },
      { label: 'Registration Date', value: '24/12/2023' },
      { label: 'Mobile Number', value: '8827556130' },
      { label: 'Exam Date', value: '21 March 2021' },
      { label: 'Exam Timing', value: '11:00 AM To 02:00 PM' },
    ];

    // Add subjectName and testname as a separate table
    (pdf as any).autoTable({
      startY: 40,
      theme: 'grid',
      styles: { font: 'helvetica', fontSize: 12 },
      body: userDetailsData.map(({ label, value }) => [label, value]),
      columnStyles: { 0: { fontStyle: 'bold' } },
    });

   // Set the position for the photo
   const photoX = 20;
   const photoY = 120;
   pdf.setLineWidth(0.2);
   // Draw a placeholder for the photo
   pdf.rect(photoX, photoY, 45, 45);
   
   // Add "Paste your photo text" inside the photo box with styling
   pdf.setFontSize(10); // Adjust font size
   pdf.text('Paste your photo', photoX + 8, photoY + 25); // Adjust positioning
 
   // Set the position for the candidate's signature
   const candidateSignX = 70;
   const candidateSignY = 120;
 
   // Draw a placeholder for the candidate's signature
   pdf.rect(candidateSignX, candidateSignY, 55, 25);

   // Add "Candidate Signature" text below the candidate's signature box
  pdf.setTextColor(0, 0, 0); // Set text color to black
  pdf.setFontSize(10); // Adjust font size
  pdf.text('Candidate Signature', candidateSignX + 5, candidateSignY + 30); // Adjust positioning
 
   // Set the position for the invigilator's signature
   const invigilatorSignX = 130;
   const invigilatorSignY = 120;
 
   // Draw a placeholder for the invigilator's signature
   pdf.rect(invigilatorSignX, invigilatorSignY, 55, 25);

   // Add "Invigilator Signature" text below the invigilator's signature box
  pdf.setTextColor(0, 0, 0); // Set text color to black
  pdf.setFontSize(10); // Adjust font size
  pdf.text('Invigilator Signature', invigilatorSignX + 5, invigilatorSignY + 30); // Adjust positioning

  // Set the position for the instructions table
  const instructionsX = 15;
  const instructionsY = 180;

  // Define instructions as an array of objects
  const instructionsData = [
    'BARRED ITEMS ARE NOT ALLOWED INSIDE EXAMINATION CENTRES.',
    'CANDIDATES FOUND IN POSSESSION WILL BE PROSECUTED AS PER RULES FOR USING UNFAIR MEANS.',
    'LAST ENTRY IN EXAM CENTRE 30 MIN BEFORE EXAM',
    'VISIT THE CENTRE ONE DAY BEFORE THE EXAMINATION TO CONFIRM THE LOCATION OF CENTRE',
    'FOLLOW ALL THE COVID-19 GUIDELINES.',
  ];

  pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('IMPORTANT INSTRUCTIONS FOR CANDIDATES', 105, 20, { align: 'center' });

  // Add instructions as a separate table with a single border and numbered points
  (pdf as any).autoTable({
    startY: instructionsY,
    theme: 'plain',
    styles: { font: 'helvetica', fontSize: 10 },
    body: instructionsData.map((instruction, index) => [`${index + 1}. ${instruction}`]),
    columnStyles: { 0: { cellWidth: 'auto', halign: 'left' } }, // Adjust column styles
    tableWidth: 'auto', // Set tableWidth to 'auto' or a specific width
  });

 
   // Add other sections similarly...

    // Save the PDF
    pdf.save('admit_card.pdf');
  }


}


