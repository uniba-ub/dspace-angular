import { Injectable } from '@angular/core';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { mergeMap, switchMap, toArray} from 'rxjs/operators';
import { AsyncSubject, from as observableFrom, Observable} from 'rxjs';
import { RemoteData } from '../data/remote-data';
import {GetRequest, PostRequest, PutRequest} from '../data/request.models';
import { RequestParam } from '../cache/models/request-param.model';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { URLCombiner } from '../url-combiner/url-combiner';
import { ObjectCacheEntry } from '../cache/object-cache.reducer';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { WorkspaceItem } from '../submission/models/workspaceitem.model';
import { Item } from '../shared/item.model';
import {PaginatedList} from './paginated-list.model';

/**
 * A service that provides methods to make REST requests with unibaversioning endpoint. No real HAL-Service, no caching necessary.
 * Basic functionality (param building) was copied from other services, mainly data-service.
 */

@Injectable()
export class VersionUnibaItemService {

  protected linkPath = 'unibaversioning';
  protected responseMsToLive = 1000 * 10;

  constructor(private requestService: RequestService,
              protected rdbService: RemoteDataBuildService,
              private objectCache: ObjectCacheService,
              protected halService: HALEndpointService){
    //
    this.halService.getEndpoint(this.linkPath).subscribe(value => {
      this.linkPath = value;
    });
  }

  /**
   * PUT Request on /{uuid:} endpoint to create new version
   * */
  public createVersion(sourceitem: string): Observable<RemoteData<WorkspaceItem>> {
    let href = this.buildHrefWithParams(this.linkPath + '/' + sourceitem, []);

    const requestId = this.requestService.generateRequestId();
    const request = new PutRequest(requestId, href, undefined);

    if (hasValue(this.responseMsToLive)) {
      request.responseMsToLive = this.responseMsToLive;
    }

    this.requestService.send(request);
    return this.rdbService.buildFromRequestUUID(requestId);
  }


  /**
   * POST Request on /{uuid:} endpoint to create new version
   * */
  public changeVersion(sourceitem: string): Observable<RemoteData<Item>> {
    let href = this.buildHrefWithParams(this.linkPath + '/change/' + sourceitem, []);

    const requestId = this.requestService.generateRequestId();
    const request = new PostRequest(requestId, href, undefined);

    if (hasValue(this.responseMsToLive)) {
      request.responseMsToLive = this.responseMsToLive;
    }

    this.requestService.send(request);
    return this.rdbService.buildFromRequestUUID(requestId);
  }

  /**
   * Get Request on /group/{uuid:} endpoint to get all versions
   * */
  public getVersionGroup(sourceitem: string): Observable<RemoteData<PaginatedList<Item[]>>> {
    let href = this.buildHrefWithParams(this.linkPath + '/group/' + sourceitem, []);

    const requestId = this.requestService.generateRequestId();
    const request = new GetRequest(requestId, href, undefined);

    if (hasValue(this.responseMsToLive)) {
      request.responseMsToLive = this.responseMsToLive;
    }

    this.requestService.send(request);
    return this.rdbService.buildFromRequestUUID(requestId);
  }

  /**
   * Get Request on /group/{uuid:} endpoint to get all versions
   * */
  public getVersionGroupIgnoreCheck(sourceitem: string): Observable<RemoteData<PaginatedList<Item>>> {
    let param = new RequestParam('ignorecheck', 'true');
    let href = this.buildHrefWithParams(this.linkPath + '/group/' + sourceitem, [param]);

    const requestId = this.requestService.generateRequestId();
    const request = new GetRequest(requestId, href, undefined);

    if (hasValue(this.responseMsToLive)) {
      request.responseMsToLive = this.responseMsToLive;
    }

    this.requestService.send(request);
    return this.rdbService.buildFromRequestUUID(requestId);
  }

  /**
   * Get Request on /group/{uuid:} endpoint to get all versions
   * */
  public getVersionGroupErrors(sourceitem: string): Observable<RemoteData<String[]>> {
    let href = this.buildHrefWithParams(this.linkPath + '/check/' + sourceitem, []);

    const requestId = this.requestService.generateRequestId();
    const request = new GetRequest(requestId, href, undefined);

    if (hasValue(this.responseMsToLive)) {
      request.responseMsToLive = this.responseMsToLive;
    }

    this.requestService.send(request);
    return this.rdbService.buildFromRequestUUID(requestId);
  }




  protected buildHrefWithParams(href: string, params: RequestParam[]): string {

    let args = [];
    if (hasValue(params)) {
      params.forEach((param: RequestParam) => {
        args = this.addHrefArg(href, args, `${param.fieldName}=${param.fieldValue}`);
      });
    }

    if (isNotEmpty(args)) {
      return new URLCombiner(href, `?${args.join('&')}`).toString();
    } else {
      return href;
    }
  }

  protected addHrefArg(href: string, currentArgs: string[], newArg: string): string[] {
    if (href.includes(newArg) || currentArgs.includes(newArg)) {
      return [...currentArgs];
    } else {
      return [...currentArgs, newArg];
    }
  }

  protected invalidateByHref(href: string): Observable<boolean> {
    const done$ = new AsyncSubject<boolean>();

    this.objectCache.getByHref(href).pipe(
      switchMap((oce: ObjectCacheEntry) => observableFrom(oce.requestUUIDs).pipe(
        mergeMap((requestUUID: string) => this.requestService.setStaleByUUID(requestUUID)),
        toArray(),
      )),
    ).subscribe(() => {
      done$.next(true);
      done$.complete();
    });

    return done$;
  }

}
