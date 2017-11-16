## Installation

Clone the repository and run `npm install`

```
git clone https://github.com/g1153567/s381f-a.git
npm install
npm start
```

## Push to git

```
rm -rf .git
git init
git add .
git commit -a -m'1st commit'
git remote add origin <your repo>
git push -f origin master
```

## Starting the server

```
npm start
```

The server will run on port 3000. You can change this by editing `config.dev.js` file.

## Run server in production

```
npm run build
```
