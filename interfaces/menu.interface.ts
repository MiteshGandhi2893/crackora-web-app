export interface SubMenu {
  id: string;
  label: string;
  isActive: boolean;
  subMenu?: Menu[];
}

export interface Menu {
  id: string;
  label: string;
  href?: string;
  icon?: React.ElementType
  imageIcon?: string;
  isActive: boolean;
  subMenu?: SubMenu[];
  slug?: string;
}