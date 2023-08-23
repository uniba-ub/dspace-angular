import { MenuItemModel } from './menu-item.model';
import { MenuItemType } from './../../menu-item-type.model';

/**
 * Model representing an Link and Icon Menu Section
 */
export class LinkIconMenuItemModel implements MenuItemModel {
  type = MenuItemType.LINKICON;
  text: string;
  icon?: string;
  style?: string;
  link: string;
  disabled: boolean;

}
