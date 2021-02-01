# backend-meang-online-shop
Backend de la tienda online desarrollado con Node TS y GraphQL 

# Inicializo tsconfig

npx tsc --init --rootDir src --outDir build --lib dom,es6 --module commonjs --target es6 --removeComments

https://www.typescriptlang.org/docs/handbook/compiler-options.html

# Instalación de librerias

npm i -E -S express graphql ncp graphql-import-node compression cors graphql-tools graphql-playground-middleware-express apollo-server-express 

npm i -D -E @types/cors @types/compression @types/express @types/node @types/graphql nodemon ts-node 

# TSLint
npm i -D typescript-tslint-plugin
npm i -D tslint

