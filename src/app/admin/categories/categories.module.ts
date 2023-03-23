import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './../../material/material.module';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';

import {SharedModule } from 'src/app/shared/shared.module';
import { CategoryComponent } from './components/containers/category/category.component'


@NgModule({
  declarations: [CategoriesComponent, CategoryFormComponent, CategoryComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    CategoriesRoutingModule,
    SharedModule
  ]
})
export class CategoriesModule { }
