import { Component, Input, inject, ChangeDetectorRef } from '@angular/core';
import {BugCard} from '../../components/bug-card/bug-card';
import {Bug} from '../../data/interfaces/catalog.interface'
import {Catalog} from '../../data/services/catalog'


@Component({
  selector: 'app-detailed-single-bug',
  imports: [BugCard],
  templateUrl: './detailed-single-bug.html',
  styleUrl: './detailed-single-bug.scss',
})
export class DetailedSingleBug {
  @Input() id!: number; 
  private cdr = inject(ChangeDetectorRef );
  private catalogService = inject(Catalog);
  bugCatalog: Bug[] = [];
  selectedBug: Bug | undefined;

  async ngOnInit() {
    try {
      this.bugCatalog = await this.catalogService.loadCatalog();
      this.selectedBug = this.bugCatalog.find(bug => bug.id == Number(this.id));
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Ошибка загрузки каталога:', error);
    }
  }
}
