import { Component, OnInit } from '@angular/core';
import { FormControl} from '@angular/forms'; //-> Nos permitira trabajar con formularios reactivos.

@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  styleUrls: ['./basic-form.component.scss']
})
export class BasicFormComponent implements OnInit {

  //Lo primero que debemos hacer es instanciar la clase FormControl
  nameField = new FormControl('Soy un control'); //-> Dentro de los parentesis podemos inicializar esta propiedad con un valor
  emailField = new FormControl();
  phoneField = new FormControl();
  colorField = new FormControl();
  dateField = new FormControl();
  ageField = new FormControl();
  textField = new FormControl();
  imgField = new FormControl();

  constructor() { }

  ngOnInit(): void {
    //Usaremos el observable valueChanges
    this.nameField.valueChanges //-> Podemos indicar que vamos a estar validando en todo momento los cambios
    .subscribe(value => {
      console.log(value);
    })

    this.colorField.valueChanges //-> Podemos indicar que vamos a estar validando en todo momento los cambios
    .subscribe(value => {
      console.log(value);
    })
  }

  getValue(){
    console.log(this.nameField.value); //--> Con esto obtengo el valor del formControl
  }

}
