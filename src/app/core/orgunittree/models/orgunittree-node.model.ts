import { autoserialize, autoserializeAs, deserialize, inheritSerialization } from 'cerialize';
import { HALLink } from '../../shared/hal-link.model';
import { DSpaceObject } from '../../shared/dspace-object.model';
import { CacheableObject } from '../../cache/cacheable-object.model';
import { ORGUNITTREENODE } from './orgunittree-node.resource-type';
import { GenericConstructor } from '../../shared/generic-constructor';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { link, typedObject } from '../../cache/builders/build-decorators';
import { Item } from '../../shared/item.model';
import { Observable } from 'rxjs';
import { RemoteData } from '../../data/remote-data';
import { ITEM } from '../../shared/item.resource-type';

@typedObject
@inheritSerialization(DSpaceObject)
export class OrgunittreeNode extends DSpaceObject implements CacheableObject {
  static type = ORGUNITTREENODE;

  @autoserialize
  public uuid: string;

  public id: string;

  @autoserialize
  public childs: string[];

  @autoserialize
  public metrics: Map<string,number>;

  @autoserialize
  public aggregatedmetrics: Map<string,number>;

  @autoserializeAs(DSpaceObject, 'item')
  public item: DSpaceObject;

  @link(ITEM, false)
  items?: Observable<RemoteData<Item>>;

  /**
   * The {@link HALLink}s for OrgunittreeNode
   */
  @deserialize
  _links: {
    self: HALLink,
    items: HALLink;
  };

  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    return [this.constructor as GenericConstructor<ListableObject>];
  }

}
