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
  templateUrl: "./enquiry-users.component.html",
  styleUrls: ["./enquiry-users.component.scss"],
})
export class EnquiryUsersComponent {
  constructor(private apiService: ApiService, private alertService: AlertService, private helper: HelperService) {
    this.userType = this.helper.getUserType();
    // if (this.userType === UserTypeEnum.ORG_ADMIN) {
    //   this.searchFilterKeys = ['name', 'mobileNo'];
    //   this.searchPlaceHolder = "Search by name, mobileNo";
    //   this.thead = this.thead.filter((x) => x.key !== 'mobileNo' && x.key !== 'orgCode');
    // }
  }
  loading = false;
  testId = '';
  btnLoading = false;
  data = [] as any;
  filteredData = [] as any;
  userData = [] as any;
  resultData = [] as any;
  userType: string = '';
  searchFilterKeys = ['firstName', 'lastName', 'mobileNo'];
  searchPlaceHolder = "Search by name, mobile no."
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
      name: 'Gender',
      sorting: true,
      key: 'gender',
      sortBy: '',
    },
    {
      name: 'Stream',
      sorting: true,
      key: 'stream',
      sortBy: '',
    },
    {
      name: 'Last Qualified Class',
      sorting: true,
      key: 'prevClass',
      sortBy: '',
    },
    {
      name: 'How Do You Come To Know',
      sorting: true,
      key: 'howDoYouComeToKnow',
      sortBy: '',
    },

  ] as TableHeader<any>[];

  ngOnInit(): void {
    this.getAllUsers();
  }

  changeData(e: any[]) {
    this.filteredData = e;
  }

  getAllUsers() {
    this.loading = true;
    this.apiService
      .getAllEnquiryUsers()
      .subscribe({
        next: (res) => {
          console.log(res)
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