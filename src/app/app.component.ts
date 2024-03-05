import { Component, ViewChild } from '@angular/core';
import { Mux } from './mux';
import { APIService } from './api.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PruebaModeloIA';

  constructor(private service : APIService){}

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
  

  submitFile() {
    this.BadRespExtract = ""
    this.errores = false
    const archivo = this.fileInput.nativeElement.files[0];
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
            console.error('Error al analizar la imagen:', error);
            this.process = false;
          });
        } else {
          this.image_base64 = 'No fue posible convertir';
        }
      };
      reader.readAsDataURL(archivo);
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

  Inicio(){
    this.Resp_Json = ""
    this.errores = false
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
            this.BadRespExtract = "no se encontró una coincidencia, porfavor contactar a servicio técnico";
        } else {
            this.BadRespExtract = error;
        }
          this.process = false;
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
