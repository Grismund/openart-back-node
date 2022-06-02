# Open Art Back End

This repository is built to handle the server side of Open Art's front end (repository for that is [here]([https://open-art.netlify.app/](https://github.com/Grismund/openartreact)).

## Status
This back end is still in development.

## Technologies Used

  - Node.js.
  - Express.
  - Mongoose.
  - MongoDB.

## Goals

I wanted to build a back end which could securely handle user registration, login, logout, and performing basic CRUD operations centered around saving artworks as favorites and making notes about them.

## Challenges

  - Secure sever-side authentication.
  - Secure user creation, logging in and out.
  - Saving artwork objects to a favorites folder.
  - Adding public comments to artworks.
  - Reporting problematic public comments.

## Solutions

  - For security, I used several approaches
    -  Cookies and Express Sessions
    -  Passport and Token-Based Authentication
    -  Mongoose Population
  -  The Schemas are still under construction.
  -  The reporting feature has not begun developement yet.

## Plans

  - Complete and integrate the back end with the front end.
  - Add functionality for users to save images as favorites.
  - Add functionality for users to publicly comment on images and report other users' problematic comments.
