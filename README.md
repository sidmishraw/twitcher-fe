# Twitcher

This is the react-native frontend for the Twitcher app.

This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app) a.k.a CRNA

This project has only been built to use [Expo client](https://itunes.apple.com/us/app/expo-client/id982107779?mt=8).

> Note: Build has been tested with `node v9.9.0` but any node version supported by the latest react-native should work fine.

## Build steps

1 . Clone the `twitcher-fe` repo on your machine.

```shell
git clone https://github.com/sidmishraw/twitcher-fe.git
```

2 . Change into the cloned repo and install dependencies using npm -- this might take some time.

```shell
cd twitcher-fe
npm install
```

3 . Have the `twitcher-be` backend service up and running.

4 . Make sure that your mobile device and the dev machine are on the same network.
Update the `localIP` and `localPort` fields in the [app.json](./app.json) file to match your machine's IP address.
The `localIP` and `localPort` are needed by the frontend to communicate with the backend server. Change the `localPort` accordingly, default is `8080`.

> Cheat: You can skip this step and let CRNA scripts do their magic. Just note down the IP address the packager asks you to connect to -- something like `exp://a.b.c.d:19000`

5 . After updating the [app.json](./app.json) just run:

```shell
yarn start
```

This will start the packager and takes some time. Once it is up, just open the Expo client on the mobile device, scan the QR code and Twitcher should be up and ready.

![demo](./resources/demo.gif)

> Note: By default the CRNA packager needs ports `19000` and `19001` open.
