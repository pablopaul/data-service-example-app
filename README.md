# Modified @ngrx example application

The original Redux based state management is replaced by a data service based state management.

This is done to make both paradigms comparable.

The goal of the comparison is to identify eventual advantages of the Redux paradigma over the state management approaches in last JavaScript MV* architectures.

## Quick start

```bash
# clone the repo
git clone https://github.com/pablopaul/data-service-example-app

# change directory to repo
cd data-service-example-app

# Use npm to install the dependencies:
npm install

# start the server
ng serve
```

Navigate to [http://localhost:4200/](http://localhost:4200/) in your browser

_NOTE:_ The above setup instructions assume you have added local npm bin folders to your path.
If this is not the case you will need to install the Angular CLI globally.