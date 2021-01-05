import { autoserialize, deserialize } from 'cerialize';

import { HALLink } from '../../../shared/hal-link.model';
import { VOCABULARY } from './vocabularies.resource-type';
import { CacheableObject } from '../../../cache/object-cache.reducer';
import { typedObject } from '../../../cache/builders/build-decorators';
import { excludeFromEquals } from '../../../utilities/equals.decorators';
import { isNotEmpty } from '../../../../shared/empty.util';

export interface VocabularyExternalSourceMap {
  [metadata: string]: string
}

/**
 * Model class for a Vocabulary
 */
@typedObject
export class Vocabulary implements CacheableObject {
  static type = VOCABULARY;
  /**
   * The identifier of this Vocabulary
   */
  @autoserialize
  id: string;

  /**
   * The name of this Vocabulary
   */
  @autoserialize
  name: string;

  /**
   * True if it is possible to scroll all the entries in the vocabulary without providing a filter parameter
   */
  @autoserialize
  scrollable: boolean;

  /**
   * True if the vocabulary exposes a tree structure where some entries are parent of others
   */
  @autoserialize
  hierarchical: boolean;

  /**
   * For hierarchical vocabularies express the preference to preload the tree at a specific
   * level of depth (0 only the top nodes are shown, 1 also their children are preloaded and so on)
   */
  @autoserialize
  preloadLevel: any;

  /**
   * If externalSource is available represent the entity type that can be use to create a new entity from
   * this vocabulary
   */
  @autoserialize
  entity: string;

  /**
   * If available represent that this vocabulary can be use to create a new entity
   */
  @autoserialize
  externalSource: VocabularyExternalSourceMap;

  /**
   * A string representing the kind of Vocabulary model
   */
  @excludeFromEquals
  @autoserialize
  public type: any;

  /**
   * The {@link HALLink}s for this Vocabulary
   */
  @deserialize
  _links: {
    self: HALLink,
    entries: HALLink
  };

  public getExternalSourceByMetadata(metadata): string {
    let sourceIdentifier = null;
    if (isNotEmpty(this.externalSource) && this.externalSource.hasOwnProperty(metadata)) {
      sourceIdentifier = this.externalSource[metadata];
    }

    return sourceIdentifier;
  }
}
