import { Component, Inject } from '@angular/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeStructuredModelComponent } from '../rendering-type-structured.model';
import { MetadataValue } from '../../../../../../../core/shared/metadata.models';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { isNotEmpty } from '../../../../../../../shared/empty.util';
import { TranslateService } from '@ngx-translate/core';
/**
 * This component renders the text metadata fields. It shows the first value in the current language and otherwise the value.
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'span[ds-text-multilingual]',
  templateUrl: './textmultilingual.component.html',
  styleUrls: ['./textmultilingual.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.TEXTMULTILINGUAL, true)
export class TextMultilingualComponent extends RenderingTypeStructuredModelComponent {


  get getField(): string {
    let locale = this.translateService.currentLang;
    let mvs: MetadataValue[] = this.item.allMetadata(this.field.metadata);
    //Only one entry, return first value;
    if(mvs.length == 1){
	return mvs[0].value;
    }
    for(let mv of mvs){
	    if(isNotEmpty(mv.language) && mv.language.indexOf(locale) == 0){
		return mv.value;
	    }
    }
    //return matching entry in default language
    let defaultlanguage = this.translateService.defaultLang;
        for(let mv of mvs){
	    if(isNotEmpty(mv.language) && mv.language.indexOf(defaultlanguage) == 0){
		return mv.value;
	    }
    	}
        //No matches for default language, return first value;
        return mvs[0].value;
  }
}
