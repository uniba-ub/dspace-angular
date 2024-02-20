import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  DynamicCheckboxModel,
  DynamicFormControlComponent,
  DynamicFormLayoutService,
  DynamicFormValidationService
} from '@ng-dynamic-forms/core';
import findKey from 'lodash/findKey';

import { hasValue, isNotEmpty } from '../../../../../empty.util';
import { DynamicListCheckboxGroupModel } from './dynamic-list-checkbox-group.model';
import { FormBuilderService } from '../../../form-builder.service';
import { DynamicListRadioGroupModel } from './dynamic-list-radio-group.model';
import { VocabularyService } from '../../../../../../core/submission/vocabularies/vocabulary.service';
import { getFirstSucceededRemoteDataPayload } from '../../../../../../core/shared/operators';
import { PaginatedList } from '../../../../../../core/data/paginated-list.model';
import { VocabularyEntry } from '../../../../../../core/submission/vocabularies/models/vocabulary-entry.model';
import { PageInfo } from '../../../../../../core/shared/page-info.model';

export interface ListItem {
  id: string;
  label: string;
  value: boolean;
  index: number;
}

/**
 * Component representing a list input field
 */
@Component({
  selector: 'ds-dynamic-list',
  styleUrls: ['./dynamic-list.component.scss'],
  templateUrl: './dynamic-list.component.html'
})
export class DsDynamicListComponent extends DynamicFormControlComponent implements OnInit, OnDestroy {

  @Input() group: UntypedFormGroup;
  @Input() model: any;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  public items: ListItem[][] = [];
  protected optionsList: VocabularyEntry[];

  /**
   * The selected option(s) in the list
   * @protected
   */
  protected currentListValue: any;

  /**
   * Subscription to model value changes
   * @protected
   */
  protected subscription: Subscription;

  constructor(private vocabularyService: VocabularyService,
              private cdr: ChangeDetectorRef,
              private formBuilderService: FormBuilderService,
              protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService
  ) {
    super(layoutService, validationService);
  }

  /**
   * Initialize the component, setting up the field options
   */
  ngOnInit() {
    if (this.model.vocabularyOptions && hasValue(this.model.vocabularyOptions.name)) {
      this.setOptionsFromVocabulary();
    }
    this.currentListValue = this.model.value;
    this.subscription = this.model.valueChanges.pipe(
      filter((value) => this.currentListValue !== value)
    ).subscribe(() => {
      this.setOptionsFromVocabulary();
    });
  }

  /**
   * Emits a blur event containing a given value.
   * @param event The value to emit.
   */
  onBlur(event: Event) {
    this.blur.emit(event);
  }

  /**
   * Emits a focus event containing a given value.
   * @param event The value to emit.
   */
  onFocus(event: Event) {
    this.focus.emit(event);
  }

  /**
   * Updates model value with the current value
   * @param event The change event.
   */
  onChange(event: Event) {
    const target = event.target as any;
    if (this.model.repeatable) {
      // Target tabindex coincide with the array index of the value into the authority list
      const entry: VocabularyEntry = this.optionsList[target.tabIndex];
      if (target.checked) {
        this.currentListValue = entry;
        this.model.valueChanges.next(entry);
      } else {
        const newValue = [];
        this.model.value
          .filter((item) => item.value !== entry.value)
          .forEach((item) => newValue.push(item));
        this.currentListValue = newValue;
        this.model.valueChanges.next(newValue);
      }
    } else {
      this.currentListValue = this.optionsList[target.value];
      (this.model as DynamicListRadioGroupModel).value = this.optionsList[target.value];
    }
    this.change.emit(event);
  }

  /**
   * Setting up the field options from vocabulary
   */
  protected setOptionsFromVocabulary() {
    if (this.model.vocabularyOptions.name && this.model.vocabularyOptions.name.length > 0) {
      const listGroup = this.group.controls[this.model.id] as UntypedFormGroup;
      if (this.model.repeatable && this.model.required) {
        listGroup.addValidators(this.hasAtLeastOneVocabularyEntry());
      }
      const pageInfo: PageInfo = new PageInfo({
        elementsPerPage: 9999, currentPage: 1
      } as PageInfo);
      this.vocabularyService.getVocabularyEntries(this.model.vocabularyOptions, pageInfo).pipe(
        getFirstSucceededRemoteDataPayload()
      ).subscribe((entries: PaginatedList<VocabularyEntry>) => {
        let groupCounter = 0;
        let itemsPerGroup = 0;
        let tempList: ListItem[] = [];
        this.optionsList = entries.page;
        // Make a list of available options (checkbox/radio) and split in groups of 'model.groupLength'
        entries.page.forEach((option: VocabularyEntry, key: number) => {
          const value = option.authority || option.value;
          let checked: boolean;
          if (this.model.repeatable) {
            checked = isNotEmpty(findKey(
              this.model.value,
              (v) => v.value === option.value));
          } else {
            checked = this.model.value && option.value === this.model.value.value;
          }

          const item: ListItem = {
            id: `${this.model.id}_${value}`,
            label: option.display,
            value: checked,
            index: key
          };
          if (this.model.repeatable) {
            this.formBuilderService.addFormGroupControl(listGroup, (this.model as DynamicListCheckboxGroupModel), new DynamicCheckboxModel(item));
          } else {
            (this.model as DynamicListRadioGroupModel).options.push({
              label: item.label,
              value: option
            });
          }
          tempList.push(item);
          itemsPerGroup++;
          this.items[groupCounter] = tempList;
          if (itemsPerGroup === this.model.groupLength) {
            groupCounter++;
            itemsPerGroup = 0;
            tempList = [];
          }
        });
        this.cdr.markForCheck();
      });

    }
  }

  /**
   * Checks if at least one {@link VocabularyEntry} has been selected.
   */
  hasAtLeastOneVocabularyEntry(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control && control.value && Object.values(control.value).find((checked: boolean) => checked === true) ? null : this.model.errorMessages;
    };
  }

  ngOnDestroy(): void {
    if (hasValue(this.subscription)) {
      this.subscription.unsubscribe();
    }
  }

}
