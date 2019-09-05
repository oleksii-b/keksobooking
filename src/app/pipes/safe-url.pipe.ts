import { Pipe } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeURL',
})
export class SafeURLPipe {
  constructor(
    private sanitizer: DomSanitizer,
  ) {}

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
