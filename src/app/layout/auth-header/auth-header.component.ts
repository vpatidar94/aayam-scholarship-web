import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExamTitleComponent } from '@shared/exam-title/exam-title.component';

@Component({
  selector: 'org-auth-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ExamTitleComponent],
  templateUrl: './auth-header.component.html',
  styleUrls: ['./auth-header.component.scss'],
})
export class AuthHeaderComponent {
  @Input() path = ''
  @Input() pathQueryParams = {};
}
