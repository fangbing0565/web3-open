export interface MenuItem {
    starlingKey?: string;
    defaultDisplayName: string;
    children?: MenuItem[];
    path?: string;
    iconType?: string;
    enable: boolean;
    order: number;
    isVisible?: boolean;
    isTest?: boolean;
    permission?: {
      regions?: string[];
    };
    permissionGroupResources?: string[];
    permissionGroupId?: string;
    targetBlank?: boolean;
    autoExpand?: boolean;
    targetBlankOecRegion?: string;
    oncallBotId?: string | number;
    icons?: {
      default?: string;
      active?: string;
    };
  }
  export type Menu = MenuItem;
  