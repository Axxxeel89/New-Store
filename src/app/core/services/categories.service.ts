import { Injectable } from '@angular/core';
import { HttpClient } from'@angular/common/http';
import { environment } from'src/environments/environment';
import { Category} from '../models/category.model'


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(
    private http:HttpClient
  ) { }

  getAllCategories(){
    return this.http.get<Category[]>(`${environment.url_api}/categories/`)
  }

  getCategories(id: string){
    return this.http.get<Category>(`${environment.url_api}/categories/${id}`)
  }

  // Partial<Category>, hacemos esto para que no ponga el Id como obligatorio.
  createCategory(data: Partial<Category>){
    return this.http.post<Category>(`${environment.url_api}/categories/`, data)
  }

  updateCategory(id: string, data: Partial<Category>){
    return this.http.put<Category>(`${environment.url_api}/categories/${id}`, data)
  }

}