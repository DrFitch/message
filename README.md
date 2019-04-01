# Messenger [![build sucsess](https://img.shields.io/badge/build-success-green.svg?style=flat)](https://github.com/DrFitch/message) ![build sucsess](https://img.shields.io/github/issues/detail/title/drfitch/message/1.svg?color=red)

![test image size](https://im3.ezgif.com/tmp/ezgif-3-47d5ea01ec91.gif)

### Application Ionic v4 de messagerie instantanée développé par Pierre & François.

Pour lancer l'application :

1. `npm install`
2. `ionic cordova prepare android`
3. `ionic cordova run android`

Problème connus : 

+ ***Compilation (google_id)*** - Problème de duplication de clef google_app_id au moment de la compilation 
  + Se rendre dans `platforms/android/android.json`
  + Supprimer les lignes suivantes : 
  ```sh
    "res/values/strings.xml": {
        "parents": {
          "/resources": [
            {
              "xml": "<string name=\"google_app_id\">@string/google_app_id</string>",
              "count": 1
            },
            {
              "xml": "<string name=\"google_api_key\">@string/google_api_key</string>",
              "count": 1
            }
          ]
        }
      }
  ```
+ ***Compilation (google_id)*** - Problème de récupération du fichier google-service.json par le plugin cordova firebase
  + Se rendre dans `plugins/cordova-plugin-firebase/scripts/after_prepare.js`
  + Changer la ligne : 
  ```sh
    var ANDROID_DIR = 'platforms/android';
  ```
  en 
  ```sh
    var ANDROID_DIR = 'platforms/android/app/src/main';
  ```
