import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteData } from '../shared/operators';
import { OrgunittreeNode } from './models/orgunittree-node.model';
import { map } from 'rxjs/operators';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list.model';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import { FindAllDataImpl } from '../data/base/find-all-data';
import { dataService } from '../data/base/data-service.decorator';
import { ORGUNITTREENODE } from './models/orgunittree-node.resource-type';
import { followLink } from '../../shared/utils/follow-link-config.model';

/**
 * Service for checking and managing the orgunittrees
 */
@Injectable()
@dataService(ORGUNITTREENODE)
export class OrgunittreeService extends IdentifiableDataService<OrgunittreeNode> {
  protected linkPath = 'orgunittree';

  private findAllData: FindAllDataImpl<OrgunittreeNode>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<any>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<OrgunittreeNode>,
  ) {
    super('orgunittree', requestService, rdbService, objectCache, halService);
    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  /**
   * Retrieve the Orgunittree Object
   */
  find(): Observable<OrgunittreeNode[]> {
    return this.findAllData.findAll(undefined, true, true, followLink('items'))
      .pipe(getFirstSucceededRemoteData(),
      map((remoteData: RemoteData<PaginatedList<OrgunittreeNode>>) => remoteData.payload),
      map((list: PaginatedList<OrgunittreeNode>) => list.page),
    );
  }

  findsingle(id: string): Observable<OrgunittreeNode> {
    return this.findById(id, true, true, followLink('items'))
      .pipe(getFirstSucceededRemoteData(),
        map((remoteData: RemoteData<OrgunittreeNode>) => remoteData.payload));
  }

  recreate(): Observable<OrgunittreeNode[]> {
    let href$: Observable<string> = this.getIDHrefObs(encodeURIComponent('recreate'));
    return this.findListByHref(href$).pipe(
      getFirstCompletedRemoteData(),
      map((remoteData: RemoteData<PaginatedList<OrgunittreeNode>>) => remoteData.payload),
      map((list: PaginatedList<OrgunittreeNode>) => list?.page)
    );
  }

}
