import { Routes } from '@angular/router';
import {CatalogAllCardsPages} from './pages/catalog-all-cards-pages/catalog-all-cards-pages'
import {CatalogType1Pages} from './pages/catalog-type1-pages/catalog-type1-pages'
import {DetailedSingleBug} from './pages/detailed-single-bug/detailed-single-bug'
import {LinksPages} from './pages/links-pages/links-pages'

export const routes: Routes = [
    {path: '', component: LinksPages},
    {path: 'allBugs', component: CatalogAllCardsPages},
    {path: 'listType1', component: CatalogType1Pages},
    {path: 'catalog/:id', component: DetailedSingleBug }
];
