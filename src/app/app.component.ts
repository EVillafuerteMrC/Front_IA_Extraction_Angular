import { Component, ViewChild } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Data } from '@angular/router';
import { Mux } from './mux';
import { ObservableLike } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PruebaModeloIA';

  constructor(private http : HttpClient){}

  @ViewChild('fileInput') fileInput:any;


  archivoSeleccionado: File | null = null ;
  base64String: string = "" ;
  image_base64: string = "";
  Resp_Json: string = "";
  Extract_Json: Mux | undefined;
  process : boolean = false;
  editable : boolean = true;

  private ApiUrl = 'http://127.0.0.1:8080/upload';
  private ExUrl = 'http://127.0.0.1:8080/extract';

  submitFile() {
    const archivo = this.fileInput.nativeElement.files[0];
    if (archivo) {
      this.archivoSeleccionado = archivo;
  
      const reader = new FileReader();
  
      reader.onload = () => {
        this.base64String = reader.result as string;
        if (this.base64String) {
          this.image_base64 = this.base64String.replace(/^data:image\/jpeg;base64,/, '');
          this.uploadImage(this.image_base64);
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
  }

  editablefunction(){
    this.editable = false
  }

  
  uploadImage(b64: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    const image_base64 = b64;
    const objJSON = { image_base64: image_base64 };
  
    const jsonString = JSON.stringify(objJSON);
    this.process = true;
    this.http.post(this.ApiUrl, jsonString, httpOptions).subscribe(
      (response) => {
        this.Resp_Json = JSON.stringify(response);
        this.process = false; // Establecer a false después de recibir la respuesta
      },
      (error) => {
        if (error && error.error && error.error.text) {
          this.Resp_Json = error.error.text;
      } else {
          this.Resp_Json = error;
      }
        this.process = false; // Establecer a false en caso de error también
      });
  }



  extractImage() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let Nombre_banco = this.Resp_Json

    this.process = true;
    this.http.post(this.ExUrl, {Nombre_banco}, httpOptions).subscribe(
      (response) => {
        this.Extract_Json = response as Mux;
        this.process = false; // Establecer a false después de recibir la respuesta
      },
      (error) => {
        if (error && error.error && error.error.text) {
          this.Extract_Json = error.error.text;
      } else {
          this.Extract_Json = error;
      }
        this.process = false; // Establecer a false en caso de error también
      });
  }


  
  resetFileInput() {
    this.fileInput.nativeElement.value = '';
    this.base64String = '';
    this.archivoSeleccionado = null;
  }
  
}
