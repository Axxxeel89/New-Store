import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/core/services/categories.service'; //-> Nos importamos el servicio de category
import { Category} from 'src/app/core/models/category.model'; //-> Importamos el modelo

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  listCategories: Category[] = [];

    //-> Este array lo necesita el componente de angular material, ya que le estamos indicando la posición, cantidad y nombre de las columnas que va a renderizar esta tabla.
  displayedColumns: string[] = ['id', 'name', 'image', 'creationAt', 'updatedAt', 'functions']

  constructor(
    private categoriesService:CategoriesService //--> Inyectamos el servicio de categories
  ) { }

  ngOnInit(): void {
    this.categoriesService.getAllCategories()
    .subscribe( data => {
      this.listCategories = data
      console.log(this.listCategories)
    })
  }


  Delete(id){
    console.log(id)
  }

}
