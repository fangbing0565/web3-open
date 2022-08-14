import { CurrentMenuInfo } from '.';
import { Menu } from './types';

export const MENU_URL =
  'https://tosv-boe.byted.org/obj/tcc-config-web-boe/tcc-v2-data-i18n_ecom.fe.partner_center-default';

function sendError(error: any) {}

export const getMenus = async (): Promise<{ menu: Menu[] } | undefined> => {
  let { menu: menus } = (window as any).gfdatav1?.garrModules || {};
  if (Array.isArray(menus) && menus.length > 0) {
    return { menu: menus };
  }

  // backup
  // will query menu api when the goofy wouldn't return the menu info.
  const headers = {
    'Content-Type': 'application/json',
  };
  const method = 'GET';
  try {
    const response: any = await fetch(MENU_URL, {
      headers,
      method,
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        menus = JSON.parse(data.data.menu2);
      });
  } catch (error) {
    sendError(error);
  }
  return {
    menu: menus ?? [],
  };
};

interface CompareObj {
  isMenuGroup: boolean;
  matchRouteLength: number;
  itemName: string;
  path: string;
  regions?: string[];
  curMenu?: Menu;
}
export const getCurrentMenu = (pathname: string, menus?: Menu[]) => {
  let res: CurrentMenuInfo = {
    path: '',
    groupName: '',
    itemName: '',
  };

  menus?.some(menu => {
    const { children = [], defaultDisplayName: groupName } = menu;
    const compareObj: CompareObj = {
      isMenuGroup: false,
      matchRouteLength: 0,
      itemName: '',
      path: '',
    };
    const {
      isMenuGroup = false,
      itemName = '',
      path = '',
      curMenu,
    } = children.reduce((previous: CompareObj, item: Menu): CompareObj => {
      const { isMenuGroup, matchRouteLength } = previous;
      const { path = '' } = item;
      const includeTo = path && pathname.startsWith(path);
      if (includeTo && (!isMenuGroup || path.length > matchRouteLength)) {
        return {
          isMenuGroup: true,
          matchRouteLength: path.length || 0,
          itemName: item.defaultDisplayName,
          path,
          curMenu: item,
        };
      }
      return previous;
    }, compareObj);
    if (isMenuGroup) {
      res = {
        path,
        groupName,
        itemName,
        curMenu,
      };
      return true;
    }
    return false;
  });
  return res;
};

export const getRegions = (menus?: Menu[]): string[] => {
  const regionSet = new Set<string>();
  // regionSet.add(REGION_LIST.UNIVERSAL);
  menus?.forEach(top =>
    top?.children?.forEach(group =>
      group?.children?.forEach(item => {
        item?.permission?.regions?.forEach(
          region => region && regionSet.add(region),
        );
      }),
    ),
  );
  return Array.from(regionSet);
};
