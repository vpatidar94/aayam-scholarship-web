import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from 'src/app/layout/dashboard-header/dashboard-header.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'org-instructions',
  standalone: true,
  imports: [CommonModule, DashboardHeaderComponent, RouterModule],
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss'],
})
export class InstructionsComponent {
  // testId = '' as string | number;
  stream ='' as string;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      // this.testId = params['testId'];
      this.stream = params['stream'];
      console.log('re',this.stream);
    });
  }

  redirectToStartTest(stream:string) {
    this.router.navigate(['/test/' + stream]);
  }
}
