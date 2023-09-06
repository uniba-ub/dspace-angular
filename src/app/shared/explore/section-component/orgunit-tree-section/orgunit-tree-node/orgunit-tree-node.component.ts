import { Component, Input, OnInit } from '@angular/core';
import { OrgunittreeNode } from '../../../../../core/orgunittree/models/orgunittree-node.model';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { DSpaceObject } from '../../../../../core/shared/dspace-object.model';
import { OrgunittreeService } from '../../../../../core/orgunittree/orgunittree.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { TreeRenderingEntriesConfig } from '../../../../../../config/tree-rendering.config';
import { hasValue } from '../../../../empty.util';
import { Item } from '../../../../../core/shared/item.model';
import { map } from 'rxjs/operators';
import { RemoteData } from '../../../../../core/data/remote-data';
import { getItemPageRoute } from '../../../../../item-page/item-page-routing-paths';

@Component({
  selector: 'ds-orgunit-tree-node',
  templateUrl: './orgunit-tree-node.component.html',
  styleUrls: ['./orgunit-tree-node.component.scss']
})
export class OrgunitTreeNodeComponent implements OnInit {

  @Input()
  inputnode: OrgunittreeNode;

  item: Observable<Item>;

  node: OrgunittreeNode = null;

  node$ = new BehaviorSubject(this.node);

  @Input()
  depth: number;

  @Input()
  metricsrendering: TreeRenderingEntriesConfig;

  @Input()
  printnochilds: boolean;

  @Input()
  uuid: string;

  path: string;

  isLoading$ = new BehaviorSubject(true);

  constructor(private dsonameservice: DSONameService,
              private orgunittreeservice: OrgunittreeService) {
    //
  }

  ngOnInit(): void {
    if (this.inputnode !== undefined) {
      this.node = this.inputnode;
      this.node$.next(this.node);

      this.orgunittreeservice.findsingle(this.node.uuid).pipe()
        .subscribe((treeobj) => {
          this.node = treeobj;
          this.node$.next(treeobj);
          this.isLoading$.next(false);
          if (this.node.item !== undefined && this.node.item instanceof DSpaceObject) {
            this.path = getItemPageRoute(this.node.item as Item);
          }
        });


      this.isLoading$.next(false);

    }
    if (this.node == null && this.uuid !== undefined) {
    // Got no node, but some id to load the subnodes!
        this.node = null;
        this.orgunittreeservice.findsingle(this.uuid).pipe()
          .subscribe((treeobj) => {
            this.node = treeobj;
            this.node$.next(treeobj);
            this.isLoading$.next(false);
            if (this.node.item !== undefined && this.node.item instanceof DSpaceObject) {
              this.path = getItemPageRoute(this.node.item as Item);
            }
          });
    } else {
      // got some node
      this.isLoading$.next(false);
    }
  }

  hasItem(): boolean {
    return this.node.item !== undefined && this.node.item instanceof DSpaceObject;
  }

  printTitle(): Observable<string> {
  return this.node.items.pipe().pipe(
    map((rd: RemoteData<Item>) => {
      if (rd?.payload !== undefined) {
        return this.dsonameservice.getName(rd.payload);
      }
      return undefined;
    })
  );
    // return (hasValue(this.node.item)) && (this.node.item instanceof DSpaceObject) ? this.dsonameservice.getName(this.node.item) : 'N.N.';
  }

  hasMetrics(metrics: string): boolean {
    if (this.node.metrics && !(this.node.metrics instanceof Map)) {
      return (this.node.metrics as Object).hasOwnProperty(metrics);
    }
    return hasValue(this.node.metrics) && this.node.metrics[metrics];
  }

  getMetricsValue(metrics: string): number {
    return hasValue(this.node.metrics[metrics]) ? this.node.metrics[metrics] : 0;
  }

  hasAggregatedMetrics(metrics: string): boolean {
    if (this.node.aggregatedmetrics && !(this.node.aggregatedmetrics instanceof Map)) {
      return (this.node.aggregatedmetrics as Object).hasOwnProperty(metrics);
    }
    return hasValue(this.node.aggregatedmetrics) && this.node.aggregatedmetrics[metrics];
  }

  getAggregatedMetricsValue(metrics: string): number {
    return hasValue(this.node.aggregatedmetrics[metrics]) ? this.node.aggregatedmetrics[metrics] : 0;
  }

  isParent(): boolean {
    return this.node !== undefined && this.node.childs !== undefined && this.node.childs.length > 0;
  }

  hasEntityIcon(): boolean {
    if (this.node.item && !(this.node.item instanceof DSpaceObject)) {
      return false;
    }
    return this.metricsrendering.entityicons &&
      (hasValue(this.metricsrendering.entityicons.find(value => value.key === this.node.item
        ?.firstMetadata('dspace.entity.type').value)));
  }
  getEntityIcon(): string {
    return this.metricsrendering.entityicons.find(value => value.key === this.node.item
      ?.firstMetadata('dspace.entity.type').value).icon;
  }
}
