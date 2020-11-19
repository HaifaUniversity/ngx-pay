import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'uoh-pay-page',
  templateUrl: './uoh-pay-page.component.html',
  styleUrls: ['./uoh-pay-page.component.css'],
})
export class UohPayPageComponent implements OnInit {
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
