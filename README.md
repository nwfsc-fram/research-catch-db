# QApp (research_catch)

A Quasar Framework app. To launch the app locally, first get the backend up and running. Do this by downloading the boatnet-internal repo and navigate to the research-catch-server directory and run yarn serve. Once it's launched check that it is running okay by going to https://localhost:9200/rcat/api-docs verify. Run front end code, research catch by following the instructions below 

To get this up and running, first launch the backend app. To do so download the boatnet-internal repo and navigate to the research-catch-server folder and run yarn serve. Navigate to https://localhost:9200/rcat/api-docs to ensure it's working. Now follow the directions below to get the front end working. 

## Install the dependencies
```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
1) First get the dev auth server up and running. To do so pull the boatnet repo onto your computer then navigate to the app/dev-auth-server directory and from there run
```yarn serve```

2) Get the backend running by pulling boatnet-internal [repo](https://github.nwfsc2.noaa.gov/nwfsc-fram-private/boatnet-internal) and run ```yarn serve```
Note: When running locally, go through browser click advanced and make sure you can see swagger hub ui thing, then code should run locally
Navigate to: https://localhost:9200/rcat/api-docs 

3) Launch research catchdb by running ```quasar dev```. If needed run yarn to build app and install dependencies. 

### Lint the files
```bash
yarn run lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
