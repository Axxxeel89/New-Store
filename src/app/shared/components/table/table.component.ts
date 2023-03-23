import { Component, OnInit, Input } from '@angular/core';
import { Category} from 'src/app/core/models/category.model'

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {


  @Input() listCategories: Category[] = []

  @Input() displayedColumns: string[] = []

  constructor() { }

  ngOnInit(): void {
  }

}
