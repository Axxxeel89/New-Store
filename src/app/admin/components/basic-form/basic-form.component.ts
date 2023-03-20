import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms'; //-> Nos permitira trabajar con formularios reactivos.

@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  styleUrls: ['./basic-form.component.scss']
})
export class BasicFormComponent implements OnInit {

  form: FormGroup;

  //FormBuilder es un servicio por lo tanto debemos inyectarlo
  constructor(
    private formBuilder:FormBuilder
  ) {
    this.buildForm(); //-> Despues de inyectado hacemos el llamado desde esta linea.
   }

  ngOnInit(): void {
    // this.form.valueChanges
    // .subscribe(values => {
    //   console.log(values)
    // })
  }

  saveForm(event: Event){
    if(this.form.valid)
    {
      console.log(this.form.value)
      alert(stringify(this.form.value))
    }else{
      this.form.markAllAsTouched();  //->Lo que hace este metodo es activar el touched
      alert("hubo un error")
    }

  }

  //Creamos un metodo prvado para poder utilizar el FormBuilder
  private buildForm(){
    this.form = this.formBuilder.group({
      fullName: this.formBuilder.group({ //-> De esta manera anidamos un FormGroup
        name: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/[a-zA-Z ]+$/)]],
        lastName: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/[a-zA-Z ]+$/)]]
      }),
      email: ['', [Validators. required, Validators.email]],
      phone: ['', Validators.required],
      color: ['#000000'],
      date: [''],
      age: [18, [Validators. required, Validators.min(18), Validators.max(80)]],
      text:[''],
      img: [''],
      category: ['category-3'],
      tag: [''],
      agreed: [false,  Validators.requiredTrue], //-->Con esto validamos que sea true
      gender: [''],

    });
  }

  //Agregamos los metodos get para key del formGroup esto con el fin de obtener la referencia de cada uno y evitarnos repetir codigo
  get nameField(){
    return this.form.get('fullName.name'); //--> Para acceder a la propiedad name o formGrouop anidado
  }

  get lastField(){
    return this.form.get('fullName.lastName'); //--> Para acceder a la propiedad name o formGrouop anidado
  }

  get emailField(){
    return this.form.get('email')
  }

  get phoneField(){
    return this.form.get('phone')
  }

  get colorField(){
    return this.form.get('color')
  }

  get dateField(){
    return this.form.get('date')
  }

  get ageField(){
    return this.form.get('age')
  }

  get textField(){
    return this.form.get('text')
  }

  get imgField(){
    return this.form.get('img')
  }

  get categoryField(){
    return this.form.get('category')
  }

  get tagField(){
    return this.form.get('tag')
  }

  get agreedField(){
    return this.form.get('agreed')
  }

  get genderField(){
    return this.form.get('gender')
  }

  get isNameFieldValid() {
    return this.nameField.touched && this.nameField.valid
  }

  get isNameFieldInValid() {
    return this.nameField.touched && this.nameField.invalid
  }

  get isLastNameFieldInValid() {
    return this.lastField.touched && this.lastField.invalid
  }

  get isPhoneFieldValid() {
    return this.phoneField.touched && this.phoneField.valid
  }

  get isPhoneFieldInValid() {
    return this.phoneField.touched && this.phoneField.invalid
  }

  get isEmailInValid() {
    return this.emailField.touched && this.emailField.invalid
  }

  get IsAgeInValid(){
    return this.ageField.touched && this.ageField.invalid
  }
  get isAgreedFieldInValid(){
    return this.agreedField.touched && this.agreedField.invalid
  }


}
