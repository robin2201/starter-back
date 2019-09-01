# starter-back
starter node + TS

# Database
  Use Atlas, add configuration into .env
  ### format:
    MONGO_CLUSTER_URI=mongodb+srv://Your_mongo_uri
    DB_NAME=yourDBName

## JWT
  You need to create a directory called .jwt
  Into this directory create a sub called rsa
  Into rsa add a key pairs RSA, used to encrypt JWT

# ROUTER
  All routes are imported automaticaly,
  Your routes need to have this structure:
   ### format:
     [
        {
              path: "/route",
              method: "POST",
              session: boolean,
              validate: schemaValidator,
              handler: [
                  handlerControllerFucntion,
                  ...
              ]
        },
        ...
      ]

# GENERATOR
  command: npm run generate "moduleName"
  this action will create a directory called moduleName
  this directory will contains files:
  ### format:
    ${moduleName}.controller.ts
    ${moduleName}.service.ts
    ${moduleName}.query.ts
    ${moduleName}.init.ts
    ${moduleName}.validator.ts
