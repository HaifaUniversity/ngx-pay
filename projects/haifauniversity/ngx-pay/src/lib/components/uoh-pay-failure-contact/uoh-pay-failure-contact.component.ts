import { Component, Input } from '@angular/core';

@Component({
  selector: 'uoh-pay-failure-contact',
  templateUrl: './uoh-pay-failure-contact.component.html',
  styleUrls: ['./uoh-pay-failure-contact.component.css'],
})
export class UohPayFailureContactComponent {
  @Input() email: string;
  @Input() subject: string;
  @Input() body: string;
  @Input() lang: string ="he";
  constructor() {}
}
