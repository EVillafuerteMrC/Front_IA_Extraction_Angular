import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(private http: HttpClient) { }

  analyzeImage(imageBase64: string): Observable<string> {
    const ApiUrl = 'http://127.0.0.1:8080/upload';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text' as 'json' // Indica que esperas una respuesta de tipo texto
    };

    const requestBody = {
      image_base64: imageBase64
    };

    return this.http.post<string>(ApiUrl, requestBody, httpOptions);
  }

  ExtractTxtImage(Nombre_banco: string): Observable<string> {
    const ExUrl = 'http://127.0.0.1:8080/extract';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };
    return this.http.post<string>(ExUrl, {Nombre_banco}, httpOptions);
  }

  SaveImg(Nombre_clase: string): Observable<string> {
    const ExUrl = 'http://127.0.0.1:8080/saveimg';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };
    return this.http.post<string>(ExUrl, {Nombre_clase}, httpOptions);
  }
}
