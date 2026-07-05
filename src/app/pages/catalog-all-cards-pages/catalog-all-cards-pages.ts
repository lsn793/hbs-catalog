import { Component, OnInit, inject, ChangeDetectorRef  } from '@angular/core';
import {BugCard} from '../../components/bug-card/bug-card';
import {Catalog} from '../../data/services/catalog'
import {Bug} from '../../data/interfaces/catalog.interface'

@Component({
  selector: 'app-catalog-all-cards-pages',
  imports: [BugCard],
  templateUrl: './catalog-all-cards-pages.html',
  styleUrl: './catalog-all-cards-pages.scss',
})
export class CatalogAllCardsPages implements OnInit {
  private cdr = inject(ChangeDetectorRef );
  private catalogService = inject(Catalog);
  bugCatalog: Bug[] = [];
  
  async ngOnInit() {
    try {
      this.bugCatalog = await this.catalogService.loadCatalog();
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Ошибка загрузки каталога:', error);
    }
  }
}
