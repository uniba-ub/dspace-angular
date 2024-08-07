import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, take } from 'rxjs/operators';

import {
  OpenaireSuggestionTarget
} from '../../../core/openaire/reciter-suggestions/models/openaire-suggestion-target.model';
import { hasValue } from '../../../shared/empty.util';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { SuggestionTargetsStateService } from './suggestion-targets.state.service';
import { getSuggestionPageRoute } from '../../../suggestions-page/suggestions-page-routing-paths';
import { SuggestionsService } from '../suggestions.service';
import { PaginationService } from '../../../core/pagination/pagination.service';

/**
 * Component to display the Suggestion Target list.
 */
@Component({
  selector: 'ds-suggestion-target',
  templateUrl: './suggestion-targets.component.html',
  styleUrls: ['./suggestion-targets.component.scss'],
})
export class SuggestionTargetsComponent implements AfterViewInit, OnInit, OnDestroy {

  /**
   * The source for which to list targets
   */
  @Input() source: string;

  /**
   * The pagination system configuration for HTML listing.
   * @type {PaginationComponentOptions}
   */
  public paginationConfig: PaginationComponentOptions;

  /**
   * The Suggestion Target list.
   */
  public targets$: Observable<OpenaireSuggestionTarget[]>;
  /**
   * The total number of Suggestion Targets.
   */
  public totalElements$: Observable<number>;
  /**
   * Array to track all the component subscriptions. Useful to unsubscribe them with 'onDestroy'.
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  /**
   * Initialize the component variables.
   * @param {PaginationService} paginationService
   * @param {SuggestionTargetsStateService} suggestionTargetsStateService
   * @param {SuggestionsService} suggestionService
   * @param {Router} router
   */
  constructor(
    private paginationService: PaginationService,
    private suggestionTargetsStateService: SuggestionTargetsStateService,
    private suggestionService: SuggestionsService,
    private router: Router
  ) {
  }

  /**
   * Component initialization.
   */
  ngOnInit(): void {
    this.paginationConfig = Object.assign(new PaginationComponentOptions(), {
      id: 'stp' + this.source,
      pageSizeOptions: [5, 10, 20, 40, 60]
    });
    this.targets$ = this.suggestionTargetsStateService.getReciterSuggestionTargets(this.source);
    this.totalElements$ = this.suggestionTargetsStateService.getReciterSuggestionTargetsTotals(this.source);
  }

  /**
   * First Suggestion Targets loading after view initialization.
   */
  ngAfterViewInit(): void {
    this.subs.push(
      this.suggestionTargetsStateService.isReciterSuggestionTargetsLoaded(this.source).pipe(
        take(1)
      ).subscribe(() => {
        this.getSuggestionTargets();
      })
    );
  }

  /**
   * Returns the information about the loading status of the Suggestion Targets (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if the targets are loading, 'false' otherwise.
   */
  public isTargetsLoading(source: string): Observable<boolean> {
    return this.suggestionTargetsStateService.isReciterSuggestionTargetsLoading(source);
  }

  /**
   * Returns the information about the processing status of the Suggestion Targets (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if there are operations running on the targets (ex.: a REST call), 'false' otherwise.
   */
  public isTargetsProcessing(): Observable<boolean> {
    return this.suggestionTargetsStateService.isReciterSuggestionTargetsProcessing(this.source);
  }

  /**
   * Redirect to suggestion page.
   *
   * @param {string} id
   *    the id of suggestion target
   * @param {string} name
   *    the name of suggestion target
   */
  public redirectToSuggestions(id: string, name: string) {
    this.router.navigate([getSuggestionPageRoute(id)]);
  }

  /**
   * Unsubscribe from all subscriptions.
   */
  ngOnDestroy(): void {
    this.suggestionTargetsStateService.dispatchClearSuggestionTargetsAction(this.source);
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

  /**
   * Dispatch the Suggestion Targets retrival.
   */
  public getSuggestionTargets(): void {
    this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig).pipe(
      distinctUntilChanged(),
      take(1)
    ).subscribe((options: PaginationComponentOptions) => {
      this.suggestionTargetsStateService.dispatchRetrieveReciterSuggestionTargets(
        this.source,
        options.pageSize,
        options.currentPage
      );
    });
  }

  public getTargetUuid(target: OpenaireSuggestionTarget) {
    return this.suggestionService.getTargetUuid(target);
  }
}
