import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms'
import { CategoriesService} from 'src/app/core/services/categories.service'  //--> Traemos el servicio de categories
import { Router, ActivatedRoute, Params } from '@angular/router';
import { finalize, map} from 'rxjs/operators' //->Este operador se encarga de avisar cuando se haga toda la carga

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
  CategoryId: string; //--> Creamos esta propiedad para guardar la información del Id que se va a recibir por url
	percentageProgressBar = 0
	showProgressBar = false
	filename: string;

  constructor(
    private formBuilder:FormBuilder,
    private categoriesService:CategoriesService,
    private router:Router,
    private FireStorage:AngularFireStorage,
    private route: ActivatedRoute  //--> Hace que podamos leer los parametros que vienen en la ruta
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params:Params) =>{
      this.CategoryId = params.id; //-> params.id, el id es segun lo que le hayamos puesto en el routing.
      if(this.CategoryId){
        this.getCategory();
      }
    })
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
      if(this.CategoryId){
        this.updateCategory();

      }
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

  //--> Creamos el metodo de editar.
  private updateCategory(){
    const data = this.form.value;
    this.categoriesService.updateCategory(this.CategoryId, data)
    .subscribe(rta => {
      console.log(rta);
      this.router.navigate(['./admin/categories'])
    })
  }


  private getCategory(){
    this.categoriesService.getCategories(this.CategoryId)
    .subscribe(data => {
      this.form.patchValue(data);
      //-> De esta manera con el patchValue pasamos toda la data al form, si hace match nos copia la informacion automaticamente si es un formulario muy grande nos permite ahorrar tiempo

      this,this.nameField.setValue(data.name)
      //-Como opción podemos agregar tambien la data valor por valor si es lo que necesitamos.
    })
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
