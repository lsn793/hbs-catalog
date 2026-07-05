import { Component, Input} from '@angular/core';
import {Bug} from '../../data/interfaces/catalog.interface'

@Component({
  selector: 'app-bug-card',
  imports: [],
  templateUrl: './bug-card.html',
  styleUrl: './bug-card.scss',
})
export class BugCard {
  @Input() bug!: Bug;
}
