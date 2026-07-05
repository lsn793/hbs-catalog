export interface BugsNode {
  id?: number;
  name: string;
  children?: BugsNode[];
  isExpanded?: boolean;
}