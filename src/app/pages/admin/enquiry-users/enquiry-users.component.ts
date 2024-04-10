import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContentHeaderComponent } from "src/app/shared/content-header/content-header.component";
import { ApiService } from "src/app/core/services/api.service";
import { AlertService } from "src/app/core/services/alert.service";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CONSTANTS, UserTypeEnum } from "src/app/core/constant/constant";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HelperService } from "src/app/core/services/helper";
import { TableHeader } from "src/app/models/table.model";
import { AyDataTableComponent } from "src/app/shared/ay-data-table/ay-data-table.component";
import { FieldValidationMessageComponent } from "@shared/field-validation-message/field-validation-message.component";

@Component({
  selector: "org-users",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ContentHeaderComponent, FieldValidationMessageComponent, RouterModule, FormsModule, AyDataTableComponent,],
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
  tForm!: FormGroup;
  loading = false;
  testId = '';
  btnLoading = false;
  data = [] as any;
  filteredData = [] as any;
  userData = [] as any;
  counsellorOptions = ["Rakesh Sharma", "Juhi Singh", "Mayank Patidar", "Sapna Pandey", "Other"];
  attenderOptions = ["Sapna Pandey", "Juhi Singh", "Aditi Rajput", "Prachi Thakur", "Other"];
  statusOptions = ['DONE', 'PENDING', 'NOT_INTERESTED', 'INTERESTED'];
  userType: string = '';
  searchFilterKeys = ['firstName', 'lastName', 'mobileNo', 'stream', 'prevClass', 'counsellor', 'excecutive', 'admissionStatus', 'createdAt' ];
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
   paginate: { currentPage: number, itemsPerPage: number, data: any[] } = { currentPage: 1, itemsPerPage: 10, data: [] };
  // filterData: any[] = [];
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
    {
      name: 'Counsellor',
      sorting: true,
      key: 'counsellor',
      sortBy: '',
    },
    {
      name: 'Executive',
      sorting: true,
      key: 'excecutive',
      sortBy: '',
    },
    {
      name: 'Admission Status',
      sorting: true,
      key: 'admissionStatus',
      sortBy: '',
    },
    {
      name: 'Remark',
      key: 'remark'
    },
    {
      name: 'Enquiry Date',
      sorting: true,
      key: 'createdAt',
      sortBy: '',
    },
    {
      name: 'Updated Date',
      sorting: true,
      key: 'updatedAt',
      sortBy: '',
    },
    {
      name: '',

    },
  ] as TableHeader<any>[];

  ngOnInit(): void {
    this.getAllUsers();
    this.tForm = new FormGroup({
      counsellor: new FormControl(null),
      attender: new FormControl(null),
      status: new FormControl(null),
      remark: new FormControl(null),
    });
  }

  // changeData(e: any[]) {
  //   this.filteredData = e;
  // }
  changeData(e: { data: any[], paginate: any }) {
    this.paginate = e.paginate;
    this.filteredData = e.data;
  }
  getAllUsers() {
    this.loading = true;
    this.apiService
      .getAllEnquiryUsers()
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

  openModel(userItem: any) {
    const modelDiv = document.getElementById('enquiryModal');
    if (modelDiv != null) {
      modelDiv.style.display = 'block';
    }
    this.userData = userItem;

    // Prefill the form controls with the user's data
    this.tForm.patchValue({
      counsellor: userItem.counsellor,
      attender: userItem.attender,
      status: userItem.admissionStatus,
      remark: userItem?.remark
    });
  }

  CloseModel() {
    const modelDiv = document.getElementById('enquiryModal');
    if (modelDiv != null) {
      modelDiv.style.display = 'none';
    }
  }

  // Method to save changes and trigger the update API call
  saveChanges() {
    const counsellor = this.tForm.value.counsellor;
    const attender = this.tForm.value.attender;
    const admissionStatus = this.tForm.value.status;
    const remark = this.tForm.value.remark;
    const userId = this.userData._id;

    const payload = { userId, counsellor, attender, admissionStatus, remark };
    this.apiService
      .enquiryUpdateApi(payload)
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.alertService.success(res.message);
          this.CloseModel();
          this.updateTableData();
        },
        error: (err) => {
          console.log("err", err)
          this.alertService.error(err.error.message);
          this.loading = false;
        }
      })

  }

  updateTableData() {
    // Find the index of the updated user in the data array
    const index = this.data.findIndex((user: any) => user._id === this.userData._id);
    // Update the user in the data array
    if (index !== -1) {
      this.data[index].counsellor = this.tForm.value.counsellor;
      this.data[index].attender = this.tForm.value.attender;
      this.data[index].admissionStatus = this.tForm.value.status;
      this.data[index].remark = this.tForm.value.remark;
    }
    // Update the filteredData array
    this.filteredData = [...this.data];
  }

  changeCounsellor() {
    const counsellor = this.tForm.get('counsellor')?.value;
  }

  changeAttender() {

  }

  changeAdmissionStatus() {

  }

  onSubmit() {

  }
  calculateStartIndex(index: number) {
    return (this.paginate.currentPage - 1) * this.paginate.itemsPerPage + index + 1;
  }
  
}