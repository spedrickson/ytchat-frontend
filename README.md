# ytchat-frontend

## About
This was started as a practice project to learn the Quasar framework. It integrates with the related ytchat-backend and a MongoDB instance to render chat history for YouTube live chats.


## Limitations
Currently, the app takes an environment variable to determine where it should query for chat history. Since the related ytchat-backend program only works with a single YouTube channel as of now, this means multiple instances of ytchat-frontend would be required for multiple YouTube channels.

## Configuration
The backend URL needs to be set as an environment variable before starting:

```bash
# bash
YTCHAT_CHANNELID=...
```

```bash
# powershell
$env:YTCHAT_CHANNELID = "..."
```


#### Supported variables
| Variable                | Purpose                                                            | Default                                              |
|-------------------------|--------------------------------------------------------------------|------------------------------------------------------|
| YTCHAT_FRONTEND_API_URL | API URL for the ytchat-backend instance the frontend should query. | `https://ytchat-api.ngrok.io/api` (API key required) |

## Install the dependencies

```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
```

### Format the files

```bash
yarn format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
