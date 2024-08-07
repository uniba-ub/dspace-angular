import {
  Component,
  Input,
} from '@angular/core';
import { Context } from 'src/app/core/shared/context.model';
import { WorkflowItem } from 'src/app/core/submission/models/workflowitem.model';
import { DuplicateMatchMetadataDetailConfig } from 'src/app/submission/sections/detect-duplicate/models/duplicate-detail-metadata.model';

import { Item } from '../../../../core/shared/item.model';
import { SearchResult } from '../../../search/models/search-result.model';
import { ThemedComponent } from '../../../theme-support/themed.component';
import { ItemListPreviewComponent } from './item-list-preview.component';

/**
 * Themed wrapper for ItemListPreviewComponent
 */
@Component({
  selector: 'ds-item-list-preview',
  styleUrls: [],
  templateUrl: '../../../theme-support/themed.component.html',
  standalone: true,
  imports: [ItemListPreviewComponent],
})
export class ThemedItemListPreviewComponent extends ThemedComponent<ItemListPreviewComponent> {
  protected inAndOutputNames: (keyof ItemListPreviewComponent & keyof this)[] = ['item', 'object', 'badgeContext', 'showSubmitter', 'showThumbnails', 'workflowItem', 'metadataList'];

  @Input() item: Item;

  @Input() object: SearchResult<any>;

  @Input() badgeContext: Context;

  @Input() showSubmitter: boolean;

  @Input() showThumbnails;

  @Input() workflowItem: WorkflowItem;

  @Input() metadataList: DuplicateMatchMetadataDetailConfig[] = [];

  protected getComponentName(): string {
    return 'ItemListPreviewComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/shared/object-list/my-dspace-result-list-element/item-list-preview/item-list-preview.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./item-list-preview.component');
  }
}
