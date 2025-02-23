# Æternity <> Ethereum Bridge

This application is created for interacting with the æternity <> EVM Bridge contracts provided by Acurast. Executing proper bridge actions using this application will result in moving the sent funds to the other chain.

## Getting started

Before running the application, first project dependencies needs to be installed with the following command:

```sh
yarn
```

Afterwards, to run the application locally in development mode, following command needs to be run at the project directory:

```sh
yarn start
```

## Build and run the application

This application doesn't contain any secrets and can be run by any machine with the following packages installed: `node, npm, yarn`

### Running locally

After completing the `Getting started` successfully, following command will build the application and make it ready to be served either on a local machine or on a server:

```sh
yarn build
```

To serve the build, there is a need for an additional package called `serve`, can be installed via:

with yarn:

```sh
yarn global add serve
```

without yarn:

```sh
npm -g install serve
```

Finally, to run the build:

```sh
serve -s build
```

### Running in a docker container

Project has a Dockerfile in place. So, it can be easly run in a docker container with the following commands:

build the container:

```sh
docker build -t aepp-bridge .
```

and run:

```sh
docker run -d -p 3000:80 aepp-bridge
```

it should be served at [localhost:3000](http://localhost:3000/)

### Running on a cloud service

If you want to run the bridge on free cloud service, following steps can be taken:

1. Fork this repository
2. Create an account for a cloud deployment service (Vercel, Netlify, AWS etc)
3. Connect your GitHub account to your cloud platform selection
4. Create a new app under your cloud service
5. Configure your application using your forked repo with the standard node application deployment settings
6. Deploy and self host your bridge application
