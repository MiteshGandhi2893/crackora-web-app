/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Entrance {
  id?: string;
  title: string;
  description: string;
  isActive: boolean;
  exams: Exam[];
}

export interface Exam {
  id?: string;
  title: string;
  description: string;
  isActive: boolean;
  slug?: string;
  category?: string;
  content?: string;
  icon?: string;
  meta_title?: string;
  meta_description?: string;
  table_index: any[];
}


export interface Week {
  label: string;
  selected: boolean;
}

export interface Timing {
  label: string;
  selected: boolean;
}