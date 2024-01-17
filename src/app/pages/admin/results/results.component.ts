import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ApiService } from "src/app/core/services/api.service";
import { AlertService } from "src/app/core/services/alert.service";
import { ContentHeaderComponent } from "src/app/shared/content-header/content-header.component";
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CONSTANTS } from "src/app/core/constant/constant";
import { HelperService } from "src/app/core/services/helper";
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "org-results",
  standalone: true,
  imports: [CommonModule, ContentHeaderComponent, AccordionModule],
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.scss"],
})
export class ResultsComponent {
  constructor(private route: ActivatedRoute, private apiService: ApiService, private alertService: AlertService, private helper: HelperService) {

    this.userType = this.helper.getUserType();
  }

  loading = false;
  data = [] as any;
  stream = '';
  selectedStream: string | null = null;
  isRankGenerated = false as boolean;
  testDetail = null as any;
  breadcrumbs = [
    {
      name: 'Results',
      path: '/admin'
    }
  ];
  btnLoading = false as boolean;
  userType: string = '';
  ngOnInit(): void {
    // Set selectedStream to the default value '9'
    this.selectedStream = '9';

    // You can also call your existing method to load data based on the default stream
    this.getStreamResults(this.selectedStream);
  }

  getStreamResults( selectedStream: string) {
    this.loading = true;
    this.selectedStream = selectedStream;

    this.apiService
      .getResultByClass(selectedStream)
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

  showTimeInMMSS(sec: number) {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  sendWpMessages() {
    this.btnLoading = true;
    const payload = {
      stream: this.selectedStream
    }

    this.apiService
      .sendWpMessage(payload)
      .subscribe({
        next: (res) => {
          this.alertService.success("Message send succesfully.");
          this.btnLoading = false;
        },
        error: (err) => {
          this.alertService.error(err.message);
          this.btnLoading = false;
        }
      });
  }

  generateRank() {
    this.btnLoading = true;
    this.apiService
      .generateRankByClass(this.selectedStream)
      .subscribe({
        next: (res) => {
          this.alertService.success(CONSTANTS.MESSAGES.GENERATED_RANK_SUCCESS);
          this.btnLoading = false;
          this.isRankGenerated = true;
        },
        error: (err) => {
          this.alertService.error(err.message);
          this.btnLoading = false;
        }
      });
  }

}
