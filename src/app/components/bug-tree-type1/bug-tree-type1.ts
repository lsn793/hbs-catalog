import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import {MatTree, MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {BugsNode} from '../../data/interfaces/bugsNode.interface'
import { RouterLink} from "@angular/router";

@Component({
  selector: 'app-bug-tree-type1',
  imports: [MatTreeModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './bug-tree-type1.html',
  styleUrl: './bug-tree-type1.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BugTreeType1 {
  @Input() bugs!: BugsNode[];
  @ViewChild(MatTree) tree!: MatTree<BugsNode>;
  childrenAccessor = (node: BugsNode) => node.children ?? [];
  expandedKey = (node: BugsNode) => node.isExpanded;
  hasChild = (_: number, node: BugsNode) => !!node.children && node.children.length > 0;
  dataSource =  EXAMPLE_DATA
  currentMaxLevel = 0;
  ngAfterViewInit() {
    // Example: Expand the first root node
    if (this.bugs && this.bugs.length > 0) {
      this.tree.expand(this.bugs[0]);
    }
  }
  expandFirstLevel(): void {
     if (!this.tree || !this.bugs || this.bugs.length === 0) return;

    // Recursively travel through tree layers and force expand target tier
    this.expandNodesAtDepth(this.bugs, 0, this.currentMaxLevel);
    
    this.currentMaxLevel++;
    }

    private expandNodesAtDepth(nodes: BugsNode[], currentDepth: number, targetDepth: number): void {
    if (!nodes) return;

    nodes.forEach(node => {
      if (currentDepth === targetDepth) {
        this.tree.expand(node);
      } else if (currentDepth < targetDepth && node.children) {
        // Keep digging deeper if we haven't reached our targeted level yet
        this.expandNodesAtDepth(node.children, currentDepth + 1, targetDepth);
      }
    });
  }
}

const EXAMPLE_DATA: BugsNode[] = [
  {
    name: 'Fruit',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
];