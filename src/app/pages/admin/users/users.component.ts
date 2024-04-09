import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContentHeaderComponent } from "src/app/shared/content-header/content-header.component";
import { ApiService } from "src/app/core/services/api.service";
import { AlertService } from "src/app/core/services/alert.service";
import { CONSTANTS, UserTypeEnum } from "src/app/core/constant/constant";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HelperService } from "src/app/core/services/helper";
import { TableHeader } from "src/app/models/table.model";
import { AyDataTableComponent } from "src/app/shared/ay-data-table/ay-data-table.component";
import { DashboardHeaderComponent } from "@layout/dashboard-header/dashboard-header.component";

@Component({
  selector: "org-users",
  standalone: true,
  imports: [CommonModule, ContentHeaderComponent, RouterModule, FormsModule, AyDataTableComponent,],
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent {
  constructor(private apiService: ApiService, private alertService: AlertService, private helper: HelperService) {
    this.userType = this.helper.getUserType();
    if (this.userType === UserTypeEnum.ORG_ADMIN) {
      this.searchFilterKeys = ['name', 'stream'];
      this.searchPlaceHolder = "Search by name, stream";
      this.thead = this.thead.filter((x) => x.key !== 'mobileNo' && x.key !== 'orgCode');
    }
  }
  loading = false;
  testId = '';
  btnLoading = false;
  data = [] as any;
  filteredData = [] as any;
  userData = [] as any;
  resultData = [] as any;
  userType: string = '';
  searchFilterKeys = ['name', 'mobileNo', 'stream', 'orgCode'];
  searchPlaceHolder = "Search by name, mobile no., stream"
  breadcrumbs = [
    {
      path: '/admin',
      name: 'Admin'
    },
    {
      path: '',
      name: 'Users'
    },
  ];


  thead = [
    {
      name: 'S.No.',
      sorting: true,
      key: 'index',
      sortBy: '',
    },
    {
      name: 'Name',
      sorting: true,
      key: 'name',
      sortBy: '',
    },
    {
      name: 'Mobile No',
      sorting: true,
      key: 'mobileNo',
      sortBy: '',
    },
    {
      name: 'City',
      sorting: true,
      key: 'city',
      sortBy: '',
    },
    {
      name: 'Stream',
      sorting: true,
      key: 'stream',
      sortBy: '',
    },
    {
      name: 'Mode',
      sorting: true,
      key: 'mode',
      sortBy: '',
    },
    {
      name: 'Roll No',
      sorting: true,
      key: 'enrollmentNo',
      sortBy: '',
    },
    {
      name: 'Test Center',
      sorting: true,
      key: 'testCenter',
      sortBy: '',
    },
    {
      name: 'Test Date',
      sorting: true,
      key: 'testDate',
      sortBy: '',
    },

    // {
    //   name: 'Tests Points',
    //   sorting: true,
    //   key: 'totalTestPoints',
    //   sortBy: '',
    // },
    // {
    //   name: 'Total Points',
    //   sorting: true,
    //   key: 'totalPoints',
    //   sortBy: '',
    // },
  ] as TableHeader<any>[];

  ngOnInit(): void {
    this.getAllUsers();
    //   this.filteredData = [{
    //     user: 'user-1',
    //     date: '7 Jan'
    //   },
    // {
    //   user: 'user-2',
    //   date: '14 Jan'
    // }]
  }

  changeData(e: { data: any[], paginate: any }) {
    // this.paginate = e.paginate;
    // this.paginate.data = e.data;
    // this.paginate.currentPage = 1;
    this.filteredData = e.data;
  }

  getAllUsers() {
    this.loading = true;
    this.apiService
      .getAllUsersResult()
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
      // Add more cases as needed for other test centers
      default:
        return '';
    }
  }



}
