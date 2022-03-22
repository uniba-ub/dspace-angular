import { Component, Inject, OnInit } from '@angular/core';
import { LinkIconMenuItemModel } from './models/linkicon.model';
import { MenuItemType } from '../initial-menus-state';
import { rendersMenuItemForType } from '../menu-item.decorator';
import { isNotEmpty } from '../../empty.util';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

/**
 * Component that renders a menu section of type LINK
 */
@Component({
  selector: 'ds-linkicon-menu-item',
    styleUrls: ['./linkicon-menu-item.component.scss'],
  templateUrl: './linkicon-menu-item.component.html'
})
@rendersMenuItemForType(MenuItemType.LINKICON)
export class LinkIconMenuItemComponent implements OnInit {
  item: LinkIconMenuItemModel;
  hasLink: boolean;
  hasIcon: boolean;
  icon: string;
  constructor(
    @Inject('itemModelProvider') item: LinkIconMenuItemModel,
    private router: Router,
    protected translateService: TranslateService,
  ) {
    this.item = item;
  }

  ngOnInit(): void {
    this.hasLink = isNotEmpty(this.item.link);
    if(this.item.icon){
    let iconsymbol: string = this.translateService.instant(this.item.icon);
    	if (iconsymbol === this.item.icon ) {
    		this.hasIcon = false
   	}else{
   		this.icon = iconsymbol;
   		this.hasIcon = true;
   	}
    }else{
    	this.hasIcon = false;
    }
  }

  getRouterLink() {
    if (this.hasLink) {
      return environment.ui.nameSpace + this.item.link;
    }
    return undefined;
  }

  navigate(event: any) {
    event.preventDefault();
    if (this.getRouterLink()) {
      this.router.navigate([this.getRouterLink()]);
    }
    event.stopPropagation();
  }

}
