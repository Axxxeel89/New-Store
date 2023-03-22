import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {MyValidators} from'src/app/utils/validators'

import { AuthService } from './../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.buildForm();
  }

  ngOnInit() {
  }

  register(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      const value = this.form.value;
      this.authService.createUser(value.email, value.password)
      .then(() => {
        this.router.navigate(['/auth/login']);
      });
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6), MyValidators.validPassword ]],
      confirmPassword: ['', [Validators.required]] ,//--> Como ambos esta ligados no es igual manejar validaciones para este campo.
      type: ['company', [Validators.required]],
      companyName: ['', [Validators.required]],

    },{
      validators: MyValidators.matchPasswords
    });

    this.typeField.valueChanges
    .subscribe( value => {
      console.log(value);
      //--> Vamos a validar si el type que valor tiene, si es company entonces es true, si es asi company es required, si no es customer y no tiene validaciones
      if(value === 'company'){
        //El metodo setValidators es el que nos permite llamar a un formControl y cambiar las validaciones
        this.companyNameField.setValidators([Validators.required])
      }else{
        this.companyNameField.setValidators(null)  //--> No tiene validaciones
      }
      this.companyNameField.updateValueAndValidity() //--> Este metodo nos actualiza el valor y lo revalida.
    })

  }

  get typeField(){
    return this.form.get('type');
  }

  get companyNameField(){
    return this.form.get('companyName');
  }



}
