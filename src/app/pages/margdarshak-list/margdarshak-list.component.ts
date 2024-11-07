import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AlertService } from "@core/services/alert.service";
import { ApiService } from "@core/services/api.service";
import { HelperService } from "@core/services/helper";
import { AyDataTableComponent } from "@shared/ay-data-table/ay-data-table.component";
import { ContentHeaderComponent } from "@shared/content-header/content-header.component";
import { TableHeader } from "src/app/models/table.model";
// import { ContentHeaderComponent } from "../../../shared/content-header/content-header.component";

@Component({
    selector: 'org-margdarshak-list',
    standalone: true,
    imports: [CommonModule, AyDataTableComponent, ContentHeaderComponent,FormsModule,ReactiveFormsModule],
    templateUrl: './margdarshak-list.component.html',
    styleUrl: './margdarshak-list.component.scss'
})

export class MargdarshakListComponent {
    constructor(private apiService: ApiService, private alertService: AlertService, private helper: HelperService) { }
    title!: 'Margdarshak';
    tForm!: FormGroup;
    loading = false;
    testId = '';
    btnLoading = false;
    data = [] as any;
    margdarshakStudentsData = [] as any;
    filteredData = [] as any;
    margdarshakStudents = [] as any;
    studentsList = [] as any;
    margdarshakName: string = "";
    userData = [] as any;
    counsellorOptions = ["Rakesh Sharma", "Juhi Singh", "Mayank Patidar", "Sapna Pandey", "Other"];
    attenderOptions = ["Sapna Pandey", "Juhi Singh", "Aditi Rajput", "Prachi Thakur", "Other"];
    statusOptions = ['DONE', 'PENDING', 'NOT_INTERESTED', 'INTERESTED'];
    userType: string = '';
    searchFilterKeys = ['code', 'name', 'mobileNo', 'gender', 'dob', 'address', 'city','email', 'occupation', 'orgName', 'associatedBy'];
    searchPlaceHolder = "Search by name, mobile no."
    breadcrumbs = [
        {
            path: '/admin',
            name: 'Admin'
        },
        {
            path: '',
            name: 'Margdarshaks'
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
        // {
        //     name: 'Category',
        //     sorting: true,
        //     key: 'margdarshakCategory',
        //     sortBy: '',
        // },
        // {
        //     name: 'Account No',
        //     sorting: true,
        //     key: 'accountNo',
        //     sortBy: '',
        // },
        // {
        //     name: 'IFSC Code',
        //     sorting: true,
        //     key: 'ifscCode',
        //     sortBy: '',
        // },
        {
            name: 'Associated By',
            sorting: true,
            key: 'associatedBy',
            sortBy: '',
        },
        {
            name: 'Date',
            sorting: true,
            key: 'createdAt',
            sortBy: '',
        },
        {
            name: '',

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
        this.getAllMargdarshakStudents();
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
    changeMargdarshakData(e: { data: any[], paginate: any }) {
        this.paginate = e.paginate;
        this.margdarshakStudents = e.data;
        
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

    getAllMargdarshakStudents() {
        this.loading = true;
        this.apiService
          .getAllEnquiryUsers()
          .subscribe({
            next: (res) => {
              this.margdarshakStudentsData = res;
              this.margdarshakStudents = res;
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
        const modelDiv = document.getElementById('margdarshakModal');
        if (modelDiv != null) {
            modelDiv.style.display = 'block';
        }
        this.userData = userItem;
        console.log("userData is",this.userData.name);
        this.margdarshakName = this.userData.name;

    //    this.studentsList=this.userData.filter(this.userData.name===this.margdarshakStudents.margdarshak)
    //    getStudentsByMargdarshak(margdarshakName: string) {
        // this.studentsList = this.userData.filter((student:any) => student.name === this.margdarshakStudents.margdarshak);
        this.studentsList = this.margdarshakStudents.filter((student:any)=> student.margdarshak === this.userData.name && student.admissionStatus!=='DONE')
    //   }

        // Prefill the form controls with the user's data
        this.tForm.patchValue({
            counsellor: userItem.counsellor,
            attender: userItem.attender,
            status: userItem.admissionStatus,
            remark: userItem?.remark
        });
        console.log("students", this.studentsList);
    }

    CloseModel() {
        const modelDiv = document.getElementById('margdarshakModal');
        if (modelDiv != null) {
            modelDiv.style.display = 'none';
        }
        console.log("studentsss", this.studentsList);
    }

    // Method to save changes and trigger the update API call
  saveChanges() {
    // const counsellor = this.tForm.value.counsellor;
    // const attender = this.tForm.value.attender;
    // const admissionStatus = this.tForm.value.status;
    // const remark = this.tForm.value.remark;
    // const userId = this.userData._id;

    // const payload = { userId, counsellor, attender, admissionStatus, remark };
    // this.apiService
    //   .enquiryUpdateApi(payload)
    //   .subscribe({
    //     next: (res) => {
    //       this.loading = false;
    //       this.alertService.success(res.message);
    //       this.CloseModel();
    //       this.updateTableData();
    //     },
    //     error: (err) => {
    //       console.log("err", err)
    //       this.alertService.error(err.error.message);
    //       this.loading = false;
    //     }
    //   })

  }

  updateTableData() {
    // Find the index of the updated user in the data array
    // const index = this.data.findIndex((user: any) => user._id === this.userData._id);
    // Update the user in the data array
    // if (index !== -1) {
    //   this.data[index].counsellor = this.tForm.value.counsellor;
    //   this.data[index].attender = this.tForm.value.attender;
    //   this.data[index].admissionStatus = this.tForm.value.status;
    //   this.data[index].remark = this.tForm.value.remark;
    // }
    // // Update the filteredData array
    // this.filteredData = [...this.data];
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
  

enquiryStudentList(): void {
    this.studentsList = this.margdarshakStudents.filter((student:any)=> student.margdarshak === this.userData.name  && student.admissionStatus!=='DONE')
}

admissionStudentList(): void {
    this.studentsList = this.margdarshakStudents.filter((student:any)=> student.margdarshak === this.userData.name  && student.admissionStatus==='DONE')

}
  
}

