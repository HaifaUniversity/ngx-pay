import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'uoh-payment-page',
  templateUrl: './uoh-payment-page.component.html',
  styleUrls: ['./uoh-payment-page.component.css'],
})
export class UohPaymentPageComponent implements OnInit {
  sanitizedUrl: SafeResourceUrl;
  @Input() width = '100px';
  @Input() height = '480';
  @Input() border = 0;
  @Input() set url(url: string) {
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}
}
