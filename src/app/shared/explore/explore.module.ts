import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopSectionComponent } from './section-component/top-section/top-section.component';
import { ThemedTopSectionComponent } from './section-component/top-section/themed-top-section.component';
import { BrowseSectionComponent } from './section-component/browse-section/browse-section.component';
import { ThemedBrowseSectionComponent } from './section-component/browse-section/themed-browse-section.component';
import { CountersSectionComponent } from './section-component/counters-section/counters-section.component';
import { ThemedCountersSectionComponent } from './section-component/counters-section/themed-counters-section.component';
import { FacetSectionComponent } from './section-component/facet-section/facet-section.component';
import { ThemedFacetSectionComponent } from './section-component/facet-section/themed-facet-section.component';
import {
  MultiColumnTopSectionComponent
} from './section-component/multi-column-top-section/multi-column-top-section.component';
import {
  ThemedMultiColumnTopSectionComponent
} from './section-component/multi-column-top-section/themed-multi-column-top-section.component';
import { SearchSectionComponent } from './section-component/search-section/search-section.component';
import { ThemedSearchSectionComponent } from './section-component/search-section/themed-search-section.component';
import { TextSectionComponent } from './section-component/text-section/text-section.component';
import { ThemedTextSectionComponent } from './section-component/text-section/themed-text-section.component';
import { OrgunittreeSectionComponent } from './section-component/orgunit-tree-section/orgunit-tree-section.component';
import { ThemedOrgunittreeSectionComponent } from './section-component/orgunit-tree-section/themed-orgunit-tree-section.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { OrgunitTreeNodeComponent } from './section-component/orgunit-tree-section/orgunit-tree-node/orgunit-tree-node.component';

import { SharedModule } from '../shared.module';

const COMPONENTS = [
  BrowseSectionComponent,
  ThemedBrowseSectionComponent,
  CountersSectionComponent,
  ThemedCountersSectionComponent,
  FacetSectionComponent,
  ThemedFacetSectionComponent,
  MultiColumnTopSectionComponent,
  ThemedMultiColumnTopSectionComponent,
  SearchSectionComponent,
  ThemedSearchSectionComponent,
  TextSectionComponent,
  ThemedTextSectionComponent,
  TopSectionComponent,
  ThemedTopSectionComponent,
  OrgunittreeSectionComponent,
  OrgunitTreeNodeComponent,
  ThemedOrgunittreeSectionComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbAccordionModule
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class ExploreModule {
}
