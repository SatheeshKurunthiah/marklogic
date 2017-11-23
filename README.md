# Pre-Requisites

* Node
* Marklogic Server

# Download dependencies 

Open cmd prompt and navigate to `Code` folder

Type `npm install`

This will download all the dependencies you needed to run the application.

# Download data

Download and place the songs data in `Data` folder in the same hierarchy of `Code` folder 

# Edit Port Bindings

Open the file `Code/app.js`
Set the port in which the server has to listen in app.Listen() function (Default is 8020)

# Create Database

Application assumes databse named `songs` is present in your system.

If not create a new database with same name or edit the name in `Code/connection.js` file.

Update `username` and `password` in the same file accordingly.

# Run Application

Open cmd prompt and navigate to `Code` folder

Type `npm run devstart` to run in development mode

When you build the application `www` executable file will be created in `bin` folder. Use this file to run in normal mode

# Test Application

Application assumes databse named `test_songs` is present in your system.

If not create a new database with same name or edit the name in `Code/connection.js` file.

Update `username` and `password` in the same file accordingly.

Open cmd promt and navigate to `Code` folder

Type `npm test` to run all the unit test