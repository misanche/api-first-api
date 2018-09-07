# About

This repo contains all API swagger files and code generator for SOS Online project.
This repo is maintained by developers of different services.
This repo generates swagger 2.2.3 compatible client code.

# Convention

## Service Name

To add a new service, add to following position:

```
/src/swaggers/<service-name>.yaml
```

## Definition Reference

Model definitions are in `/src/models.yaml`

Create the definition in the models file first and ref it in the service yaml file.

Security definitions are in `/src/auth.yaml` same as models

For some endpoints definition that needs to be used in different services, store them into `/src/partials/<partial name>.yaml` then ref it into service yaml file.

To refer a yaml file use relative path like below:

```
./src/models.yaml
```

**Note Please use models.yaml and auth.yaml as much as possible to avoid duplicated definition**

e.g.

```yaml
definitions:
  Hello:
    $ref: ./src/models.yaml#/Hello
```
while in models.yaml

```yaml
Hello:
  type: object
  properties:
    #.....
```

## Folder structure

**src/**

Contains all source yaml files. Any new component or changes should goto here directly.

**build/**

Contains all swagger files in whole. Files in this folder should be used in fes service's `definition/` folder. The files in this folder are generated from `src/` thus no changes should be made to the files.

**dist/**

Contains all generated code for different languages. Used by clients. The files in this folder are generated from `build/` thus no changes should be made to the files. 

# Code Gen

Requirement:

* Java
* nodejs 6+
* npm


Check out the repo first:

```
git clone https://kxiang@gitlab.consulting.redhat.com/rhte-api/api.git
```


After code checkout

```bash
npm i
```

then use following command to print out help

```bash

npm run api -- --help

```



### List all components / APIs**

```bash
npm run api -- -l
```

### Build and compile a component

```bash

npm run api -- --bc <component name>

```

### Validate component swagger file

```bash
npm run api -- --validate <component name>
```





