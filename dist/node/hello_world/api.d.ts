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
/// <reference types="node" />
import localVarRequest = require('request');
import http = require('http');
import Promise = require('bluebird');
export declare class Hello {
    'msg': string;
    static discriminator: any;
    static attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
    }[];
}
export declare class ModelError {
    'message': string;
    'extra': any;
    'code': string;
    static discriminator: any;
    static attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
    }[];
}
export interface Authentication {
    /**
    * Apply authentication settings to header and query params.
    */
    applyToRequest(requestOptions: localVarRequest.Options): void;
}
export declare class HttpBasicAuth implements Authentication {
    username: string;
    password: string;
    applyToRequest(requestOptions: localVarRequest.Options): void;
}
export declare class ApiKeyAuth implements Authentication {
    private location;
    private paramName;
    apiKey: string;
    constructor(location: string, paramName: string);
    applyToRequest(requestOptions: localVarRequest.Options): void;
}
export declare class OAuth implements Authentication {
    accessToken: string;
    applyToRequest(requestOptions: localVarRequest.Options): void;
}
export declare class VoidAuth implements Authentication {
    username: string;
    password: string;
    applyToRequest(_: localVarRequest.Options): void;
}
export declare enum HelloApiApiKeys {
}
export declare class HelloApi {
    protected _basePath: string;
    protected defaultHeaders: any;
    protected _useQuerystring: boolean;
    protected authentications: {
        'default': Authentication;
    };
    constructor(basePath?: string);
    useQuerystring: boolean;
    basePath: string;
    setDefaultAuthentication(auth: Authentication): void;
    setApiKey(key: HelloApiApiKeys, value: string): void;
    /**
     * Returns Hello world string via GET.
     * @param greeting Name of greeting
     */
    helloWorldGet(greeting: string): Promise<{
        response: http.ClientResponse;
        body: Hello;
    }>;
    /**
     * Returns Hello world string via POST.
     * @param greeting Name of greeting
     */
    helloWorldPost(greeting: string): Promise<{
        response: http.ClientResponse;
        body: Hello;
    }>;
}
