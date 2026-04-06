export interface SubMenu {
  id: string;
  label: string;
  isActive?: boolean;
  subMenu?: Menu[];
   href?: string;
}

export interface Menu {
  id: string;
  label: string;
  href?: string;
  icon?: React.ElementType
  imageIcon?: string;
  isActive?: boolean;
  subMenu?: SubMenu[];
  slug?: string;
  target?:string;
}