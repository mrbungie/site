// Portfolio of projects. If the array is empty, the "Work" section is hidden.
// year: string · title/desc: Spanish · titleEN/descEN: English (optional) · tags · href (optional)

export interface Project {
  year: string;
  title: string;
  titleEN?: string;
  desc: string;
  descEN?: string;
  tags: string[];
  href?: string;
}

export const projects: Project[] = [];
