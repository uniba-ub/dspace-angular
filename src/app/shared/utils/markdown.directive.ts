import {
  Directive,
  ElementRef,
  Inject,
  InjectionToken,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SecurityContext,
  SimpleChanges,
} from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
} from '@angular/platform-browser';
import { Subject } from 'rxjs';
import {
  filter,
  take,
  takeUntil,
} from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { MathService } from '../../core/shared/math.service';
import { isEmpty } from '../empty.util';

const markdownItLoader = async () => (await import('markdown-it')).default;
type LazyMarkdownIt = ReturnType<typeof markdownItLoader>;
const MARKDOWN_IT = new InjectionToken<LazyMarkdownIt>(
  'Lazily loaded MarkdownIt',
  { providedIn: 'root', factory: markdownItLoader },
);

@Directive({
  selector: '[dsMarkdown]',
  standalone: true,
})
export class MarkdownDirective implements OnChanges, OnDestroy {

  @Input() dsMarkdown: string;
  private alive$ = new Subject<boolean>();

  el: HTMLElement;

  constructor(
    @Inject(MARKDOWN_IT) private markdownIt: LazyMarkdownIt,
    protected sanitizer: DomSanitizer,
    private mathService: MathService,
    private elementRef: ElementRef) {
    this.el = elementRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dsMarkdown && changes.dsMarkdown.currentValue !== changes.dsMarkdown.previousValue) {
      this.render(changes.dsMarkdown.currentValue);
    }
  }

  async render(value: string, forcePreview = false): Promise<SafeHtml> {
    if (isEmpty(value) || (!environment.markdown.enabled && !forcePreview)) {
      this.el.innerHTML = value;
      return;
    } else {
    const MarkdownIt = await this.markdownIt;
    const md = new MarkdownIt({
      html: true,
      linkify: true,
    });

    const html = this.sanitizer.sanitize(SecurityContext.HTML, md.render(value));
    this.el.innerHTML = html;

    if (environment.markdown.mathjax) {
      this.renderMathjax();
    }
  }
  }

  private renderMathjax() {
    this.mathService.ready().pipe(
      filter((ready) => ready),
      take(1),
      takeUntil(this.alive$),
    ).subscribe(() => {
      this.mathService.render(this.el);
    });
  }

  ngOnDestroy() {
    this.alive$.next(false);
  }
}
