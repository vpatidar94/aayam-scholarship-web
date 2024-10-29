import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { AlertService } from "@core/services/alert.service";
import { ApiService } from "@core/services/api.service";
import { HelperService } from "@core/services/helper";
import { AyDataTableComponent } from "@shared/ay-data-table/ay-data-table.component";
import { TableHeader } from "src/app/models/table.model";

@Component({
    selector: 'org-margdarshaks',
    standalone: true,
    imports: [CommonModule, AyDataTableComponent],
    templateUrl: './margdarshaks.component.html',
    styleUrl: './margdarshaks.component.scss'
})

export class MargdarshaksComponent {
    constructor(private apiService: ApiService, private alertService: AlertService, private helper: HelperService) {}

    title!: 'Margdarshak';



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
        name: 'Code',
        sorting: true,
        key: 'code',
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
      name: 'DOB',
      sorting: true,
      key: 'dob',
      sortBy: '',
    },
    {
        name: 'email',
        sorting: true,
        key: 'email',
        sortBy: '',
      },
      {
        name: 'address',
        sorting: true,
        key: 'address',
        sortBy: '',
      },
      {
        name: 'city',
        sorting: true,
        key: 'city',
        sortBy: '',
      },
    //   {
    //     name: 'DOB',
    //     sorting: true,
    //     key: 'dob',
    //     sortBy: '',
    //   },
      {
        name: 'Occupation',
        sorting: true,
        key: 'occupation',
        sortBy: '',
      },
      {
        name: 'Org Name',
        sorting: true,
        key: 'orgName',
        sortBy: '',
      },
      {
        name: 'Category',
        sorting: true,
        key: 'margdarshakCategory',
        sortBy: '',
      },
      {
        name: 'Account No',
        sorting: true,
        key: 'accountNo',
        sortBy: '',
      },
      {
        name: 'IFSC Code',
        sorting: true,
        key: 'ifscCode',
        sortBy: '',
      },
      {
        name: 'Associated By',
        sorting: true,
        key: 'associatedBy',
        sortBy: '',
      },
    //   {
    //     name: 'DOB',
    //     sorting: true,
    //     key: 'dob',
    //     sortBy: '',
    //   },
    // {
    //   name: 'Last Qualified Class',
    //   sorting: true,
    //   key: 'prevClass',
    //   sortBy: '',
    // },
    // {
    //   name: 'How Do You Come To Know',
    //   sorting: true,
    //   key: 'howDoYouComeToKnow',
    //   sortBy: '',
    // },
    // {
    //   name: 'Counsellor',
    //   sorting: true,
    //   key: 'counsellor',
    //   sortBy: '',
    // },
    // {
    //   name: 'Executive',
    //   sorting: true,
    //   key: 'excecutive',
    //   sortBy: '',
    // },
    // {
    //   name: 'Admission Status',
    //   sorting: true,
    //   key: 'admissionStatus',
    //   sortBy: '',
    // },
    // {
    //   name: 'Remark',
    //   key: 'remark'
    // },
    // {
    //   name: 'Enquiry Date',
    //   sorting: true,
    //   key: 'createdAt',
    //   sortBy: '',
    // },
    // {
    //   name: 'Updated Date',
    //   sorting: true,
    //   key: 'updatedAt',
    //   sortBy: '',
    // },
    // {
    //   name: '',

    // },
  ] as TableHeader<any>[];

  ngOnInit(): void {
    this.getAllMargdarshaks();
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
  getAllMargdarshaks() {
    this.loading = true;
    this.apiService
      .getAllMargdarshakss()
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

  calculateStartIndex(index: number) {
    return (this.paginate.currentPage - 1) * this.paginate.itemsPerPage + index + 1;
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

}