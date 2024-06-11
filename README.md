# LZW Algorithm Tool

## Introduction
This tool allows to compress and decompress texts (strings) using the LZW algorithm, which is usually used to compress GIFs.
It also shows each step it takes during the process using a table.

_Note that there are a few symbols that should be avoided when entering strings into the tool:_
- The forward slash (/) is reserved as a placeholder for a new line in entered texts to maintain readability of whitespaces
- The underscore (_) is reserved as a placeholder for a space for the same reason
- Addresses used for compression are enclosed in brackets (<256>), so they are reserved for addresses also

## Installation and Usage
To use the provided source code, the Node.js manager **npm** needs to be installed. Please make sure to follow a guide on how to do so for your operating system.
Getting started then is as easy as running

```npm install```

which will install a few dependencies necessary to use the tool, followed by

```npm run start```

This will start the lightweight webserver snowpack on port 8080. You can then take a look at the running program and use it by entering `localhost:8080` into any web browser of your choice.

### Have fun experimenting!