import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { finalize, map} from 'rxjs/operators' //->Este operador se encarga de avisar cuando se haga toda la carga

//Models
import { Category} from 'src/app/core/models/category.model'

//firestorage
import { AngularFireStorage } from '@angular/fire/compat/storage'; //-->Traemos el fireStorage para guardar la imagen

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {

  form:FormGroup;
  id: string;
  percentageProgressBar = 0
	showProgressBar = false
	filename: string;
  CategoryId: string; //--> Creamos esta propiedad para guardar la información del Id que se va a recibir por url
  isNew: boolean = true; //-->Lo usaremos para saber si es un create o un edit

  //Recordemos que para recuperar datos debemos tener el form.patchValue que es el que nos va a pasar la información al formulario para esto usaremos un set dentro de un input
  //Ahora tenemos que category paso hacer un metodo.
  @Input() set category(data: Category){
    if(data){
      this.isNew= false; //->Si es false entonces es un edit pasaremos este flag al metodo para que sepa distingir
      this.form.patchValue(data)
    }
  }

  @Output() create = new EventEmitter();
  @Output() Update = new EventEmitter();

  constructor(
    private formBuilder:FormBuilder,
    private FireStorage:AngularFireStorage,
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.form.patchValue(this.category)
  }


  private buildForm(){
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      image: ['', Validators.required]
    })
  }

  get nameField(){
    return this.form.get('name');
  }

  get imageField(){
    return this.form.get('image');
  }

  //Vamos a configurar el servicio para guardar una categoria.
  save(): void{
    if(this.form.valid){
      if(this.isNew){
        this.create.emit(this.form.value)
      }
      else{
        this.Update.emit(this.form.value)
      }
    }else{
      this.form.markAllAsTouched();
    }
  }


  // nameGenerico:string =  this.generateUUID()

  uploadFile(event){

    const image = event.target.files[0];
    const name =this.generateUUID();
    const ref = this.FireStorage.ref(name) //-> Creamos la referencia
    const task = this.FireStorage.upload(name, image) //-> Subimos la imagen combiando el name and image

    //Task basicamente es un observable, el cual va a estar validando los cambios.

    // task.snapshotChanges() //-> El nos indica cual es el momento exacto que va a recibir la imagen
    // .pipe(
    //   finalize(() => { //--> Recordemos que finalize nos avisa cuando termina de hacer la carga
    //     //->Obtenemos la url de la imagen y es un observable y para obtener el valor debemos suscribirnos
    //     const urlImage$ = ref.getDownloadURL(); //->Al setear directamente no es necesario el formControlName en el formulario.
    //     urlImage$.subscribe( url => {
    //       console.log(url);
    //       console.log(name);
    //       this.imageField.setValue(url);

    //     })
    //   })
    // )
    // .subscribe(rta =>{

    // })

    task.percentageChanges()
    .pipe(map(Math.ceil))
    .pipe(finalize(() => {
      const urlImage = ref.getDownloadURL()
      urlImage.subscribe(url => {
        this.imageField.setValue(url)
        this.filename = image.name;
        console.log(url);
      })
      this.showProgressBar = true
    }))
    .subscribe(per => {
      this.percentageProgressBar = per
    })

  }

   generateUUID() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

}
