import { MenuItemModel } from './menu-item.model';
import { MenuItemType } from '../../initial-menus-state';

/**
 * Model representing an Link and Icon Menu Section
 */
export class LinkIconMenuItemModel implements MenuItemModel {
  type = MenuItemType.LINKICON;
  text: string;
  icon?: string;
  link: string;

}
