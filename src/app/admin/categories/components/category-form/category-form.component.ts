import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms'
import { CategoriesService} from 'src/app/core/services/categories.service'  //--> Traemos el servicio de categories
import { Router } from '@angular/router';
import { finalize} from 'rxjs/operators' //->Este operador se encarga de avisar cuando se haga toda la carga

//firestorage
import { AngularFireStorage } from '@angular/fire/compat/storage'; //-->Traemos el fireStorage para guardar la imagen

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {

  form:FormGroup;

  constructor(
    private formBuilder:FormBuilder,
    private categoriesService:CategoriesService,
    private router:Router,
    private FireStorage:AngularFireStorage
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
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
      this.createCategory()
    }else{
      this.form.markAllAsTouched();
    }
  }

  private createCategory(){
    const data = this.form.value;
    this.categoriesService.createCategory(data)
    .subscribe(rta => {
      console.log(rta);
      this.router.navigate(['./admin/categories'])
    })
  }

  // nameGenerico:string =  this.generateUUID()

  uploadFile(event){

    const image = event.target.files[0];
    const name =this.generateUUID();
    const ref = this.FireStorage.ref(name) //-> Creamos la referencia
    const task = this.FireStorage.upload(name, image) //-> Subimos la imagen combiando el name and image

    //Task basicamente es un observable, el cual va a estar validando los cambios.

    task.snapshotChanges() //-> El nos indica cual es el momento exacto que va a recibir la imagen
    .pipe(
      finalize(() => { //--> Recordemos que finalize nos avisa cuando termina de hacer la carga
        //->Obtenemos la url de la imagen y es un observable y para obtener el valor debemos suscribirnos
        const urlImage$ = ref.getDownloadURL(); //->Al setear directamente no es necesario el formControlName en el formulario.
        urlImage$.subscribe( url => {
          console.log(url);
          console.log(name);
          this.imageField.setValue(url);

        })
      })
    )
    .subscribe(rta =>{

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
