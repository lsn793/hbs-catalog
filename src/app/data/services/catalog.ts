import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { isDevMode } from '@angular/core';
import {Bug} from '../interfaces/catalog.interface'
import {BugsNode} from '../interfaces/bugsNode.interface'

@Injectable({
  providedIn: 'root',
})
export class Catalog {
  http:HttpClient = inject(HttpClient);
  baseApiUrl:string  = 'http://127.0.0.1:8000';
  baseUrl: string = "";

  readonly catalog = signal<Bug[]>([]);
  private cachedBugCatalog: Bug[] | null = null;
  private cachedBugCatalogType1: BugsNode[] | null = null;

  constructor(){
    if (isDevMode()) {
     this.baseUrl = "/data/";
    } else {
      this.baseUrl = "http://api.myprodserver.com/";
    }
  }
  
  getCatalog(){//depricated, use loadCatalog(it cashes response from server)
    return this.http.get<Bug[]>(`${this.baseUrl}catalog.json`);
  }

  loadCatalog(): Promise<Bug[]> {
    if (this.cachedBugCatalog) {
      return Promise.resolve(this.cachedBugCatalog);
    }

    return new Promise((resolve, reject) => {
      this.http.get<Bug[]>(`${this.baseUrl}catalog.json`).subscribe({
        next: (data) => {
          this.cachedBugCatalog = data; 
          resolve(data);            
        },
        error: (err) => {
          reject(err);             
        }
      });
    });
  }

  //load catalog from server and create sorted catalog and cache it (used in catalog-type1 page)
  async loadCatalogType1() {
    if (this.cachedBugCatalogType1) {
      return this.cachedBugCatalogType1;
    }

    try {
      let bugCatalog = await this.loadCatalog();
      this.cachedBugCatalogType1 =  this.convertToUITreeData(bugCatalog);
    }
    catch (error) {
      console.error('Ошибка загрузки каталога:', error);
    }
    return this.cachedBugCatalogType1;
  }

  private convertToUITreeData(bugCatalog: Bug[]) : BugsNode[]{
    let bugsSorted: BugsNode[]= [];
    for(let bug of bugCatalog){
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
    return bugsSorted;
  }


  /*
  https://v17.angular.io/tutorial/tour-of-heroes/toh-pt6
  import { catchError, map, tap } from 'rxjs/operators';
  getHeroes(): Observable<Hero[]> {
  return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }*/
}
