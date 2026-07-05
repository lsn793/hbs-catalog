import { Component, OnInit, inject, signal } from '@angular/core';
import { rxResource } from "@angular/core/rxjs-interop";
import {BugTreeType1} from '../../components/bug-tree-type1/bug-tree-type1';
import {Catalog} from '../../data/services/catalog'
import {BugsNode} from '../../data/interfaces/bugsNode.interface'
import {Bug} from '../../data/interfaces/catalog.interface'

@Component({
  selector: 'app-catalog-type1-pages',
  imports: [BugTreeType1],
  templateUrl: './catalog-type1-pages.html',
  styleUrl: './catalog-type1-pages.scss',
})
export class CatalogType1Pages {
  private catalogService = inject(Catalog);
  bugCatalog: Bug[] = [];
  UITreeDataSource = signal <BugsNode[]>([]);
  async ngOnInit() {
        let bugsSorted = await this.catalogService.loadCatalogType1();    
        this.UITreeDataSource.set(bugsSorted || []);

    /*try {
      this.bugCatalog = await this.catalogService.loadCatalog();
      this.convertToUITreeData();
    } catch (error) {
      console.error('Ошибка загрузки каталога:', error);
    }*/
  }

  convertToUITreeData(){
    let bugsSorted: BugsNode[]= [];
    for(let bug of this.bugCatalog){
      let  node: BugsNode = {name:bug.name, isExpanded: false, id: bug.id}
      let  node0: BugsNode = {name:bug.family, children: [node], isExpanded: false }
      let  node1: BugsNode = {name:bug.superfamily, children: [node0], isExpanded: false }    
      let  node2: BugsNode = {name:bug.suborder, children: [node1], isExpanded: false }  
      
      let orderIndex: number = -1;  
      let suborderIndex: number = -1;  
      let superfamilyIndex: number = -1;  
      let familyIndex: number = -1;  
      bugsSorted.forEach((node, index) => {
        if (node.name==bug.order) {
          orderIndex = index;
        }
        node.children?.forEach((node, index) => {
          if (node.name==bug.suborder) {
            suborderIndex = index;
          }
          node.children?.forEach((node, index) => {
            if (node.name==bug.superfamily) {
              superfamilyIndex = index;
            }
            node.children?.forEach((node, index) => {
              if (node.name==bug.family) {
                familyIndex = index;
              }
            })
          })
        })
      })

      if(orderIndex < 0) {
          bugsSorted.push({name: bug.order, children: [node2]})
          continue;
      }
      if(suborderIndex < 0) {
          bugsSorted[orderIndex].children?.push({name: bug.suborder, children: [node1]})
          continue;
      }
      if(superfamilyIndex < 0) {
          bugsSorted[orderIndex].children![suborderIndex].children?.push({name: bug.superfamily, children: [node0]})
          continue;
      }
      if(familyIndex < 0) {
          bugsSorted[orderIndex].children![suborderIndex].children![superfamilyIndex].children?.push({name: bug.family, children: [node]})
          continue;
      }
      bugsSorted[orderIndex].children![suborderIndex].children![superfamilyIndex].children![familyIndex].children?.push({name: bug.name,isExpanded: true, id: bug.id})
    }
    this.UITreeDataSource.set(bugsSorted);
  }
}
