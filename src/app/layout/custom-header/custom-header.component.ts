import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'org-custom-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss'],
})
export class CustomHeaderComponent {
  constructor(private apiService: ApiService) { }
  @Input() path = ''
  // @Input() showPanel = false;
  @Input() showLogout = false;
  @Input() title = ''
  @Input() subTitle = ''


  @Output() togglePanel = new EventEmitter<boolean>();

  emitTogglePanel(value: boolean) {
    this.togglePanel.emit(value)
  }

 
  triggerLogout() {
    this.apiService.logout();
  }

}
