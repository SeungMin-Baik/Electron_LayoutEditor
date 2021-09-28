
## This editor supports free content design and supports downloading as .png

<br />

![11](https://user-images.githubusercontent.com/59187220/134611193-9b4e0ffb-c70e-4464-bf49-33426f59e1ae.png)
![22](https://user-images.githubusercontent.com/59187220/134611222-19ca4d73-e4dd-4a20-8975-e7c8d703ef68.png)


## Tech Stack

* Node.js
* Electron
* ReactJS
* Typescript
* SCSS
* NeDB

## Version Info 

* NodeJS : 10.16.0
* MSBuildTool (need for building project) : 14.0 (Visual studio 2015)

## Entering dev mode 

1. Install package with command **[yarn]** and **[yarn.lock]** file
2. Command **[yarn dev]**

## Build project (release)

1. Install node-gyp module as global (Run cmd as administrator -> **[yarn add global node-gyp]**)
2. Install two libraries related to building canvas through this website ( https://github.com/Automattic/node-canvas/wiki/Installation:-Windows )
  >* GTK 
  >* libjpeg-turbo
3. Install package with command **[yarn]** and **[yarn.lock]** file
4. Modify node_module 
  * Remove folder **[node_modules\@types\react-native]**
  * Modify code 
  

	#if (V8_MAJOR_VERSION >= 8)
	data = static_cast<char*>(buffer->GetBackingStore()->Data()) + byte_offset;
	#else
	data = static_cast<char*>(buffer->GetContents().Data()) + byte_offset;
      
      to
      
  
	#if (V8_MAJOR_VERSION >= 8)
	data = static_cast<char*>(buffer->GetContents().Data()) + byte_offset;
	#else
	data = static_cast<char*>(buffer->GetContents().Data()) + byte_offset;
  
    in **[node_modules\canvas\node_modules\nan\nan_typedarray_contents.h]** 
5. Run yarn package-osname (ex. win64bit -> yarn package-win64)

## Issue

![에디터-이슈1](https://user-images.githubusercontent.com/59187220/134611331-69e578f5-db51-4e8f-8015-1954aa972d2e.png)

If you see this error, Remove folder [node_modules@types\react-native]
