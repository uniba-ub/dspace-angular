import {Inject} from '@angular/core';
import { FormFieldModel } from '../models/form-field.model';
import {
  CONFIG_DATA,
  FieldParser,
  INIT_FORM_VALUES,
  PARSER_OPTIONS,
  SECURITY_CONFIG,
  SUBMISSION_ID
} from './field-parser';
import { DynamicFormControlLayout, } from '@ng-dynamic-forms/core';
import {
  DynamicScrollableDropdownModel,
  DynamicScrollableDropdownModelConfig
} from '../ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { isNotEmpty } from '../../../empty.util';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { ParserOptions } from './parser-options';
import { TranslateService } from '@ngx-translate/core';

export class DropdownFieldParser extends FieldParser {

  constructor(
    @Inject(SUBMISSION_ID) submissionId: string,
    @Inject(CONFIG_DATA) configData: FormFieldModel,
    @Inject(INIT_FORM_VALUES) initFormValues,
    @Inject(PARSER_OPTIONS) parserOptions: ParserOptions,
    @Inject(SECURITY_CONFIG)  securityConfig: any = null,
    translate: TranslateService
  ) {
    super(submissionId, configData, initFormValues, parserOptions, securityConfig, translate);
  }

  public modelFactory(fieldValue?: FormFieldMetadataValueObject | any, label?: boolean): any {
    const dropdownModelConfig: DynamicScrollableDropdownModelConfig = this.initModel(null, label);
    let layout: DynamicFormControlLayout;

    if (isNotEmpty(this.configData.selectableMetadata[0].controlledVocabulary)) {
      this.setVocabularyOptions(dropdownModelConfig, this.parserOptions.collectionUUID);
      this.setValues(dropdownModelConfig, fieldValue, true);
      layout = {
        element: {
          control: 'col'
        },
        grid: {
          host: 'col'
        }
      };
      const dropdownModel = new DynamicScrollableDropdownModel(dropdownModelConfig, layout);
      return dropdownModel;
    } else {
      throw  Error(`Controlled Vocabulary name is not available. Please check the form configuration file.`);
    }
  }
}
