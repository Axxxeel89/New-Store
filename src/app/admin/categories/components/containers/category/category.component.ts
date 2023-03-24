import { Component, OnInit } from '@angular/core';
import { CategoriesService} from 'src/app/core/services/categories.service'  //--> Traemos el servicio de categories
import { Router, ActivatedRoute, Params } from '@angular/router';

//Models
import { Category} from 'src/app/core/models/category.model'

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  category: Category;

  constructor(
    private categoriesService:CategoriesService,
    private router:Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params:Params) =>{
      const id = params.id; //-> params.id, el id es segun lo que le hayamos puesto en el routing.
      if(params.id){
        this.getCategory(params.id);
      }
    })
  }

  createCategory(data){
    this.categoriesService.createCategory(data)
    .subscribe(rta => {
      this.router.navigate(['./admin/categories'])
    })
  }

  //--> Creamos el metodo de editar.
  updateCategory(data){
    this.categoriesService.updateCategory(this.category.id, data)
    .subscribe(rta => {
      this.router.navigate(['./admin/categories'])
    })
  }


  private getCategory(id: string){
    this.categoriesService.getCategories(id)
    .subscribe(data => {
      this.category = data
    })
  }

}
