import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Category } from 'src/app/core/models/category.model'
import { CategoriesService } from 'src/app/core/services/categories.service';

import { finalize } from 'rxjs/operators';

import { MyValidators } from './../../../../utils/validators';
import { ProductsService } from './../../../../core/services/products/products.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  form: UntypedFormGroup;
  id: string;
  image$: Observable<any>;

  categories: Category[] = []

  constructor(
    private formBuilder: UntypedFormBuilder,
    private productsService: ProductsService,
    private storage: AngularFireStorage,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoriesService:CategoriesService
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params.id;
      this.productsService.getProduct(this.id)
      .subscribe(product => {
        this.form.patchValue(product);
        console.log(this.form)
      });
    });
    this.getCategories()

  }

  saveProduct(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      const product = this.form.value;
      this.productsService.updateProduct(this.id, product)
      .subscribe((newProduct) => {
        console.log(newProduct);
        this.router.navigate(['./admin/products']);
      });
    }
  }

  private getCategories(){
    this.categoriesService.getAllCategories()
    .subscribe(cat => {
      this.categories = cat;
      console.log(cat)
    })
  }

  uploadFile(event) {
    const files = [...event.target.files] ;
    files.forEach(item => {
      const name = `${item.name}`;
      const fileRef = this.storage.ref(name);
      const task = this.storage.upload(name, item);
      task.snapshotChanges()
      .pipe(
        finalize(() => {
          this.image$ = fileRef.getDownloadURL();
          this.image$.subscribe(url => {
            const fileList = this.imagesField.value as string[]
            this.imagesField.setValue([...fileList, url ])
          });
        })
      )
      .subscribe();
    })

    if (files) {
      this.imagesField.setValue([] as string[])
    }

  }


  private buildForm() {
    this.form = this.formBuilder.group({
      id: ['', [Validators.required]],
      title: ['', [Validators.required]],
      price: ['', [Validators.required, MyValidators.isPriceValid]],
      images: [''],
      category: [''],
      description: ['', [Validators.required]],
    });
  }

  get priceField() {
    return this.form.get('price');
  }

  get imagesField(){
    return this.form.get('images')
  }

}
