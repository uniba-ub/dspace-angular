import { SectionComponent } from '../../../../core/layout/models/section.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { OrgunittreeService } from '../../../../core/orgunittree/orgunittree.service';
import { OrgunittreeNode } from '../../../../core/orgunittree/models/orgunittree-node.model';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../../core/data/feature-authorization/feature-id';
import { map } from 'rxjs/operators';
import { RemoteData } from '../../../../core/data/remote-data';
import { ConfigurationProperty } from '../../../../core/shared/configuration-property.model';
import { ConfigurationDataService } from '../../../../core/data/configuration-data.service';
import { hasValue } from '../../../empty.util';
import { environment } from '../../../../../environments/environment';
import { TreeRenderingEntriesConfig } from '../../../../../config/tree-rendering.config';

@Component({
  selector: 'ds-orgunit-tree-section',
  templateUrl: './orgunit-tree-section.component.html'
})
export class OrgunittreeSectionComponent implements OnInit {

  @Input()
  sectionId: string;

  @Input()
  treeSection: TreeSection;

  isLoading$ = new BehaviorSubject(true);

  metricsrendering: TreeRenderingEntriesConfig;

  tree: OrgunittreeNode[] ;
  tree$: Observable<OrgunittreeNode[]>;
  isAdmin: boolean ;
  isAdmin$: Observable<boolean>;
  isEnabled$: Observable<boolean>;

  constructor(private orgunittreeservice: OrgunittreeService,
              protected authorizationService: AuthorizationDataService,
              private configurationService: ConfigurationDataService) {
    this.tree$ = new BehaviorSubject(this.tree);
    this.isAdmin$ = new BehaviorSubject(this.isAdmin);
    this.isEnabled$ = this.configurationService.findByPropertyName('orgunittree.enabled').pipe(
      map((rd: RemoteData<ConfigurationProperty>) => {
        return rd.isSuccess;
      })
    );
    this.metricsrendering = environment.treeRendering.entries.find(entry => entry.treename === 'orgunittree');
  }

  ngOnInit() {
    this.tree = [];
    this.orgunittreeservice.find().subscribe((treeobj) => {
      this.tree = treeobj;
      //as OrgunittreeNode[];
      this.isLoading$.next(false);
    });
    this.isAdmin$ = this.authorizationService.isAuthorized(FeatureID.AdministratorOf);
  }

  hasTree(): boolean {
    return hasValue(this.tree);
  }

  recreate(){
    this.isLoading$.next(true);
    this.tree = [];
    this.orgunittreeservice.recreate().subscribe((treeobj) => {
      this.tree = treeobj;
      //as OrgunittreeNode[];
      this.isLoading$.next(false);
    });
  }
}

export interface TreeSection extends SectionComponent {
  title: string;
}

