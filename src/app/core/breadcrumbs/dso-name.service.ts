import { Injectable } from '@angular/core';
import { hasValue, isEmpty } from '../../shared/empty.util';
import { DSpaceObject } from '../shared/dspace-object.model';
import { MetadataValue } from '../shared/metadata.models';
import { TranslateService } from '@ngx-translate/core';

/**
 * Returns a name for a {@link DSpaceObject} based
 * on its render types.
 */
@Injectable({
  providedIn: 'root'
})
export class DSONameService {

  constructor(private translateService: TranslateService) {

  }

  /**
   * Functions to generate the specific names.
   *
   * If this list ever expands it will probably be worth it to
   * refactor this using decorators for specific entity types,
   * or perhaps by using a dedicated model for each entity type
   *
   * With only two exceptions those solutions seem overkill for now.
   */
  private readonly factories = {
    Person: (dso: DSpaceObject): string => {
      const familyName = dso.firstMetadataValue('person.familyName');
      const givenName = dso.firstMetadataValue('person.givenName');
      if (isEmpty(familyName) && isEmpty(givenName)) {
        return dso.firstMetadataValue('dc.title') || dso.name;
      } else {
        return `${familyName}, ${givenName}`;
      }
    },
    OrgUnit: (dso: DSpaceObject): string => {
      return dso.firstMetadataValue('organization.legalName') || this.multilingualTitle(dso, 'dc.title') || dso.firstMetadataValue('dc.title');
    },
    Default: (dso: DSpaceObject): string => {
      // If object doesn't have dc.title metadata use name property
      return this.multilingualTitle(dso, 'dc.title') || dso.firstMetadataValue('dc.title') || dso.name || this.translateService.instant('dso.name.untitled');
    }
  };
  /*
  * returns the first matching entry in the current locale or the first value.
  */
  multilingualTitle(dso: DSpaceObject, field: string): string {
    const locale = this.translateService.currentLang;
    const mvs: MetadataValue[] = dso.allMetadata(field);
            // Only one entry, return first value;
      // if (mvs.length === 1 && mvs[0] !== undefined) return mvs[0].value;
    for (const mv of mvs) {
      if (mv.language !== undefined && mv.language !== '' && mv.language.indexOf(locale) === 0) {
        // return matching entry
        return mv.value;
      }
    }
  // No matches for language, return first value;
    if (mvs[0] !== undefined) {
      return mvs[0].value;
    } else {
      return undefined;
    }
  }

  /**
   * Get the name for the given {@link DSpaceObject}
   *
   * @param dso  The {@link DSpaceObject} you want a name for
   */
  getName(dso: DSpaceObject): string {
    const types = dso.getRenderTypes();
    const match = types
      .filter((type) => typeof type === 'string')
      .find((type: string) => Object.keys(this.factories).includes(type)) as string;

    if (hasValue(match)) {
      return this.factories[match](dso);
    } else {
      return  this.factories.Default(dso);
    }
  }

}
