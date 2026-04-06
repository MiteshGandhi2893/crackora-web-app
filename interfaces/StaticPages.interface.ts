

  export interface PageSection {
    number:string;
    title:string;
    intro?: string;
    bullets?: string[];
    body?: string;
    subSections?: PageSubSection[]
  }


  export interface PageSubSection {
    subTitle: string;
    intro?: string;
    bullets?:string[];
    after?: string;
  }