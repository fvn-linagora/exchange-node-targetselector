# Migration targets selector

Provide a list of domain users associated with a given group name. \
Query remote domain's Active Directory servers.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine
for development and testing purposes.
See deployment for notes on how to deploy the project on a live system.

### Prerequisities

- Docker daemon (>= 1.10)
- (OPTIONAL) Docker Compose (>= v1.8)

For contributing purpose, you'll need to also install :
- Node (>= 6.0) for ES6

### Installing

- Install required dependencies
```sh
npm install
```
- Edit server configuration `./config/serverConfig.js` according to your environment:

```javascript
const config = {
    url: 'ldap://AD1.mslablgs.vm.obm-int.dc1',
    baseDN: 'DC=mslablgs,DC=vm,DC=obm-int,DC=dc1'
};

module.exports = config;
```

- Run target selection, providing server's credential to query users directory.

```sh
PASSWORD=secret LOGIN=SuparUsar node index
```

- Alternatively using docker compose.

```sh
PASSWORD=secret LOGIN=SuparUsar docker-compose up
```

## Running the tests

Explain how to run the automated tests for this system

```sh
npm run test
```

## Deployment

Note that environment variables `LOGIN` and `PASSWORD` are used to pass directory server's (AD) credential.
Default login is `Administrator`

- Start a new container (build when missing)

```sh
PASSWORD=secret LOGIN=Administrator docker-compose up
```

- or (without docker compose):
```sh
docker run --rm -e PASSWORD=secret migration-targets-selector --group "Angry Users"
```
- (Optional) To build docker image in your local environment :

```sh
docker build -t migration-targets-selector .
```

## Built With

* Nifty tools

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning..

## Authors

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- inspired by this [README template](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)

