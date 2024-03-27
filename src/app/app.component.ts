import { Component, ViewChild } from '@angular/core';
import { APIService } from './api.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
[x: string]: any;
  title = 'PruebaModeloIA';

  constructor(private service : APIService, private snackBar: MatSnackBar){}

  @ViewChild('fileInput') fileInput:any;


  archivoSeleccionado: File | null = null ;
  base64String: string = "" ;
  image_base64: string = "";
  Extract_Json: any
  process : boolean = false;
  editable : boolean = true;
  errores : boolean = false;
  BadRespExtract: string ="";
  nombre_clase: string = ""
  styleconf0: any
  styleconf1: any
  styleconf2: any  
  
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
            this.service.analyzeImage(this.image_base64) .subscribe(     
              (response) => {
              this.Extract_Json = JSON.parse(response);
              this.process = false;
            },
            (error) => {
              if (error.status == 404) {
                let errortxt = JSON.stringify(error.error)
                this.showAlert(errortxt+", porfavor contactar a servicio técnico")
            } else {
                this.BadRespExtract = error.name
                this.showAlert('Ocurrio un problema, contacte a soporte técnico '+this.BadRespExtract)
            }
              this.process = false;
              this.reset()
            });
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
    this.Extract_Json = null
    this.errores = false 
    this.BadRespExtract = ''
    this.nombre_clase = ""
  }

  editablefunction(){
    this.editable = false
  }

  
  resetFileInput() {
    this.fileInput.nativeElement.value = '';
    this.base64String = '';
    this.archivoSeleccionado = null;
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

  confidencestyle2(){

    if (this.Extract_Json.ConfidenceNro['2']< 0.25) {
      this.styleconf2 = 'red'
    } else if (this.Extract_Json.ConfidenceNro['2']>= 0.25 && this.Extract_Json.ConfidenceNro['2']< 0.50) {
      this.styleconf2 = 'yellow'
    } else if (this.Extract_Json.ConfidenceNro['2']>= 0.50 && this.Extract_Json.ConfidenceNro['2']< 0.75) {
      this.styleconf2 = 'light-green'
    } else{
      this.styleconf2 = 'dark-green'
    }
    return this.styleconf2
  }

  confidencestyle1(){
    
    if (this.Extract_Json.ConfidenceNro['1']< 0.25) {
      this.styleconf1 ='red'
    } else if (this.Extract_Json.ConfidenceNro['1']>= 0.25 && this.Extract_Json.ConfidenceNro['1']< 0.50) {
      this.styleconf1 ='yellow'
    } else if (this.Extract_Json.ConfidenceNro['1']>= 0.50 && this.Extract_Json.ConfidenceNro['1']< 0.75) {
      this.styleconf1 = 'light-green'
    } else{
      this.styleconf1 ='dark-green'
    }
    return this.styleconf1
  }

  confidencestyle0(){
    if (this.Extract_Json.ConfidenceNro['0']< 0.25) {
      this.styleconf0 = 'red' 
    } else if (this.Extract_Json.ConfidenceNro['0']>= 0.25 && this.Extract_Json.ConfidenceNro['0']< 0.50) {
      this.styleconf0 = 'yellow'
    } else if (this.Extract_Json.ConfidenceNro['0']>= 0.50 && this.Extract_Json.ConfidenceNro['0']< 0.75) {
      this.styleconf0 = 'light-green'
    } else{
      this.styleconf0 = 'dark-green'
    }
    return this.styleconf0
  }
}
