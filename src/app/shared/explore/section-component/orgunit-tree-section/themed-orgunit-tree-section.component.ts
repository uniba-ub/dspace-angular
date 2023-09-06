import { ThemedComponent } from '../../../theme-support/themed.component';
import { OrgunittreeSectionComponent } from './orgunit-tree-section.component';
import { Component, Input } from '@angular/core';
import { TreeSection } from './orgunit-tree-section.component';

@Component({
  selector: 'ds-themed-orgunit-tree-section',
  styleUrls: [],
  templateUrl: '../../../theme-support/themed.component.html',
})
export class ThemedOrgunittreeSectionComponent extends ThemedComponent<OrgunittreeSectionComponent> {

  @Input()
  sectionId: string;

  @Input()
  treeSection: TreeSection;

  protected inAndOutputNames: (keyof OrgunittreeSectionComponent & keyof this)[] = ['sectionId', 'treeSection'];

  protected getComponentName(): string {
    return 'OrgunittreeSectionComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/shared/explore/section-component/orgunit-tree-section/orgunit-tree-section.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./orgunit-tree-section.component`);
  }

}
