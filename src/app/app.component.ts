import { Component, ViewChild } from '@angular/core';
import { Mux } from './mux';
import { APIService } from './api.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PruebaModeloIA';

  constructor(private service : APIService, private snackBar: MatSnackBar){}

  @ViewChild('fileInput') fileInput:any;


  archivoSeleccionado: File | null = null ;
  base64String: string = "" ;
  image_base64: string = "";
  Resp_Json: string = "";
  Extract_Json: Mux | undefined;
  process : boolean = false;
  editable : boolean = true;
  errores : boolean = false;
  BadRespExtract: string ="";
  BadPrediction: boolean = false;
  nombre_clase: string = ""
  
  showAlert(message: string, action: string = 'Cerrar') {
    const config = new MatSnackBarConfig();
    config.duration = 100000 ; 
    config.verticalPosition = 'top'; 
    config.panelClass = ['custom-class'];
    this.snackBar.open(message, action, config);
  }  


  submitFile(event : any) {
    this.snackBar.dismiss();
    this.BadRespExtract = ""
    this.errores = false
    // const archivo = this.fileInput.nativeElement.files[0];
    const archivo = event.target.files[0];

    if(archivo){
      let ArchivoName = archivo.name
      if (ArchivoName.endsWith('.jpg') || ArchivoName.endsWith('.jpeg') || ArchivoName.endsWith('.png')) {
        this.archivoSeleccionado = archivo;
    
        const reader = new FileReader();
    
        reader.onload = () => {
          this.base64String = reader.result as string;
          if (this.base64String) {
            this.image_base64 = this.base64String.replace(/^data:image\/jpeg;base64,/, '');
            this.process = true;
            this.service.analyzeImage(this.image_base64) .subscribe(prediction => {
              this.Resp_Json = prediction;
              this.process = false;
            }, error => {
              this.errores = true
              this.showAlert('Error al analizar la imagen, contacte a soporte')
              this.reset()
              this.process = false
            });
          } else {
            this.showAlert('No fue posible convertir')
          }
        };
        reader.readAsDataURL(archivo);
      }
      else{
        this.showAlert('Este tipo archivo no se puede subir.');
        this.resetFileInput()
      }
    }
    else
    {
      this.showAlert('Seleccione un archivo');
        this.resetFileInput()
    }
  }

  reset(){
    this.base64String = ""
    this.editable=true
    this.base64String = ""
    this.image_base64 = ""
    this.Resp_Json = ""
    this.Extract_Json = undefined
    this.errores = false 
    this.BadRespExtract = ''
    this.BadPrediction = false
    this.nombre_clase = ""
  }

  editablefunction(){
    this.editable = false
  }

  extractImage() {
      let Nombre_banco = this.Resp_Json
  
      this.process = true;
      this.service.ExtractTxtImage(Nombre_banco).subscribe(
        (response) => {
          this.Extract_Json = response as unknown as Mux;
          this.process = false;
        },
        (error) => {
          if (error.status == 404) {
            this.showAlert("no se encontró una coincidencia, porfavor contactar a servicio técnico")
        } else {
            this.BadRespExtract = error.name
            this.showAlert('Ocurrio un problema, contacte a soporte técnico '+this.BadRespExtract)
        }
          this.process = false;
          this.reset()
        });
    }
  
  resetFileInput() {
    this.fileInput.nativeElement.value = '';
    this.base64String = '';
    this.archivoSeleccionado = null;
  }

  BadPredict(){
    this.BadPrediction = true
  }

  regresar(){
    this.BadPrediction = false
    this.reset()
  }
  
  saveImg(){
    this.process = true;
    this.service.SaveImg(this.nombre_clase).subscribe(
      (response) => {
        this.process = false; 
      },
      (error) => {
        this.process = false; 
      });
    this.reset()
  }

}
