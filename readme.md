## Mail Direct

Mail Direct is an app where you can store images and a detailed explanation of mail that comes in the mail.

## Technologies Used

- Bootstrap
- Node.js
- Postgres SQL
- Express
- EJS
- Cloudinary API
- HTML, CSS, JS

## User Stories

- As a user, I want to be able to sign up and login in to Mail Direct.
- As a user, I want to be able to access the home page, creating new image post page, and the category with stored information.
- As a user, I want to be able to post a new image with the Cloudinary API with detailed information on that picture then store under specific category.
- As a user, I want to be able edit title of selected mail and delete entire mail.
- As a user, I want to have the ability to log out and have secured routes.

## To run on your machine

1. Fork and clone
2. run npm i in your terminal to install dependencies
3. Create a config.json with the following code:

```
{
  "development": {
    "database": "<insert development db name here>",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "database": "<insert test name here>",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "database": "<insert production name here>",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

**NOTE:** If your database requires a username and password, you'll need to include these as well.

4. Create database <br>

```
sequelize db:create <insert db name here>
```

5. Migrate the `user` model to database <br>

```
sequelize db:migrate
```

6. Add `SESSION_SECRET` and `PORT` environment variables in a `.env` file(can be any string)

7. Run `nodemon` to start up app

## Wireframe

https://www.figma.com/file/NGJCfYAXlmuMfAaZ0YJTXB/Project-2

## ERD

https://lucid.app/invitations/accept/a97e44d5-bc1e-4d7e-9dfa-28363fc189d6

## Creating Routes

| Routes         | CRUD   | Explanation                                |
| -------------- | ------ | ------------------------------------------ |
| "/"            | GET    | Renders to home page                       |
| "/cloud"       | POST   | Uploades pictures to API                   |
| "new-mail"     | GET    | Creates new mail credentials               |
| "/:id"         | PUT    | Updates title of mail                      |
| "/:id"         | DELETE | Deletes everything you choose in category  |
| "/:id"         | GET    | Shows everything in category               |
| "/profile"     | GET    | Shows current user and what mail they made |
| "/auth/login"  | GET    | Shows login page                           |
| "/auth/signup" | GET    | Shows signup page                          |
| "/auth/signup" | POST   | Creates new user                           |
| "/auth/logout" | GET    | Logs out current user                      |

## Challenges

- Trying to figure out the Cloudinary API was a challenge, there are still bits of it I dont understand but get the general idea of it.
- Getting each category to show up in my model was challenging, but I was shown a cool way of doing it.
- Styling was a challenge since I've never styled a website. I used Bootstrap for a good amount of the page and that wasn't easy.

## Stretch Goals

- Making my website with more Bootstrap to make it look better and more modern.
- Making a mobile version, and give the user the ability to use their phone camera instead of Cloudinary.
- Making use of user profiles better.
- Giving the user the ability give more details of mail they create.
