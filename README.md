# Cardgamer

## Introduction
Cardgamer is a multiplayer card game web app developed by [jinwonn](https://github.com/jinwonn/), [Anael Berrouet](https://github.com/AnaelBerrouet) and [Jerry Song](https://github.com/jerry1646). This minimum viable product is developed as the midterm project for Lighthouse Labs web development bootcamp over the course of 5 days.

Cardgamer allows an user to create an new account, log in and play a game of War with someone else on the page. 

It is also deployed on Heroku [here](https://lit-journey-41271.herokuapp.com/) 

## Getting Started on Local Server

1. Clone this repository.
2. Install dependencies using the npm install command.
3. Update parameters in .env file in order to properly link the app to the database.
4. Start the web server using the npm start local command. The app will be served at http://localhost:8080/.

## Getting Started on Heroku

1. Go to https://lit-journey-41271.herokuapp.com/
2. Create an account by clicking "Register" on the navigation bar. If you already have an account, click "Login".
3. Select "War" to join a game of War, enjoy! (You may want to gather a couple of friends to play together)


## Dependencies
- express.js
- socket.io
- pg
- node-sass-middleware
- morgan
- knex, knex-logger
- gulp
- ejs
- dotenv
- cookie-session
- connect-flash
- body-parser
- bcrypt
- Node 5.10.x or above
- NPM 3.8.x or above
