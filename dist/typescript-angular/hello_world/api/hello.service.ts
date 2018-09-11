/**
 * Simple Hello World API
 * API for Hello World Service.
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams }               from '@angular/common/http';

import { Observable }                                        from 'rxjs/Observable';
import '../rxjs-operators';

import { Hello } from '../model/hello';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';


@Injectable()
export class HelloService {

    protected basePath = 'https://localhost:8001/api';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (let consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * 
     * Returns Hello world string via GET.
     * @param greeting Name of greeting
     */
    public helloWorldGet(greeting: string): Observable<Hello> {
        if (greeting === null || greeting === undefined) {
            throw new Error('Required parameter greeting was null or undefined when calling helloWorldGet.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (greeting !== undefined) {
            queryParameters = queryParameters.set('greeting', <any>greeting);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json',
            'application/octet-stream'
        ];

        return this.httpClient.get<any>(`${this.basePath}/hello`,
            {
                params: queryParameters,
                headers: headers,
                withCredentials: this.configuration.withCredentials,
            }
        );
    }

    /**
     * 
     * Returns Hello world string via POST.
     * @param greeting Name of greeting
     */
    public helloWorldPost(greeting: string): Observable<Hello> {
        if (greeting === null || greeting === undefined) {
            throw new Error('Required parameter greeting was null or undefined when calling helloWorldPost.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (greeting !== undefined) {
            queryParameters = queryParameters.set('greeting', <any>greeting);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json',
            'application/octet-stream'
        ];

        return this.httpClient.post<any>(`${this.basePath}/hello`,
            null,
            {
                params: queryParameters,
                headers: headers,
                withCredentials: this.configuration.withCredentials,
            }
        );
    }

}
