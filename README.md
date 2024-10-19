# MilkTeaAngular

npm install ngx-toastr --save
npm install @angular/animations --save

 "scripts": {
      "ng": "ng",
      "start": "ng serve",
      "build": "ng build",
      "build:ssr:Admin": "ng build --project=Admin && ng run Admin:server",
      "build:ssr:User": "ng build --project=User && ng run User:server",
      "serve:ssr:Admin": "node dist/admin/server/server.mjs",
      "serve:ssr:User": "node dist/user/server/server.mjs",
      "start:ssr:Admin": "npm run build:ssr:Admin && npm run serve:ssr:Admin",
      "start:ssr:User": "npm run build:ssr:User && npm run serve:ssr:User",
      "watch": "ng build --watch --configuration development",
      "test": "ng test"
    },
 
 ##Angualar.json
 {
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "Admin": {
      "projectType": "application",
      "schematics": {},
      "root": "projects/admin",
      "sourceRoot": "projects/admin/src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/admin",
            "index": "projects/admin/src/index.html",
            "browser": "projects/admin/src/main.ts",
            "polyfills": [
              "zone.js"
            ],
            "tsConfig": "projects/admin/tsconfig.app.json",
            "assets": [
              {
                "glob": "**/*",
                "input": "projects/admin/public"
              }
            ],
            "styles": [
              "projects/admin/src/styles.css"
            ],
            "scripts": [],
            "server": "projects/admin/src/main.server.ts",
            "prerender": true,
            "ssr": {
              "entry": "projects/admin/server.ts"
            }
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kB",
                  "maximumError": "1MB"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kB",
                  "maximumError": "4kB"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "Admin:build:production"
            },
            "development": {
              "buildTarget": "Admin:build:development"
            }
          },
          "defaultConfiguration": "development"
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n"
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "polyfills": [
              "zone.js",
              "zone.js/testing"
            ],
            "tsConfig": "projects/admin/tsconfig.spec.json",
            "assets": [
              {
                "glob": "**/*",
                "input": "projects/admin/public"
              }
            ],
            "styles": [
              "projects/admin/src/styles.css"
            ],
            "scripts": []
          }
        }
      }
    },
    "User": {
      "projectType": "application",
      "schematics": {},
      "root": "projects/user",
      "sourceRoot": "projects/user/src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/user",
            "index": "projects/user/src/index.html",
            "browser": "projects/user/src/main.ts",
            "polyfills": [
              "zone.js"
            ],
            "tsConfig": "projects/user/tsconfig.app.json",
            "assets": [
              {
                "glob": "**/*",
                "input": "projects/user/public"
              }
            ],
            "styles": [
              "projects/user/src/styles.css"
            ],
            "scripts": [],
            "server": "projects/user/src/main.server.ts",
            "prerender": true,
            "ssr": {
              "entry": "projects/user/server.ts"
            }
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kB",
                  "maximumError": "1MB"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kB",
                  "maximumError": "4kB"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "User:build:production"
            },
            "development": {
              "buildTarget": "User:build:development"
            }
          },
          "defaultConfiguration": "development"
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n"
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "polyfills": [
              "zone.js",
              "zone.js/testing"
            ],
            "tsConfig": "projects/user/tsconfig.spec.json",
            "assets": [
              {
                "glob": "**/*",
                "input": "projects/user/public"
              }
            ],
            "styles": [
              "projects/user/src/styles.css"
            ],
            "scripts": []
          }
        }
      }
    }
  }
}

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
