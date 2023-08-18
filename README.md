# Northcoders News API

## Lex's Northcoders News API

Welcome to my RESTful API for Northcoders News. This reddit-style news aggregation site has been built as part of a 13-week bootcamp in software engineering. This API has been built using Node.js, Express.JS, PSQL and....

This repo is for the back-end code for this project. 

**You can find a hosted version of this here: https://lexs-nc-news.onrender.com/api**

<br>

## Installation

<br>


Before setting up the project make sure that you have the following installed: 

#### Node

I have developed this using v18.16.1

```
node-v
```

This command will tell you the version of node that you are runing if you have it installed. If you do not, follow the setup instructions here: 

**https://nodejs.org/en/download/package-manager**

#### Npm 

I have developed this using 9.5.1



```
npm -v
```

This command will tell you the version of npm you have, if you have it installed already. If you do not have npm installed, first make sure you have node installed (as described above), then run:

```
npm install
```

#### PostgreSQL

I have developed this using PostgreSQL V15.4

https://www.postgresql.org/

<br>

## Getting Started
<br>

1. You will need to clone this repository. Clone this repository by running the following command in your terminal: 

```
git clone https://github.com/Lex5mith/Northcoders-News.git
```

2. Create two .env files in order to successfully connect to the two databases locally:

`.env.development` 
```
PGDATABASE=nc_news
```

`.env.test`
```
PGDATABASE=nc_news_test
```

3. Install npm by running the following command:

```
npm install
```
 
This will install the following dependencies, no I don't necessarily need to list them as they should automatically install, but what can I say, I like to double check things. If you're like me and you like to check that things are working like they should, or just like having a nosey at whats going on, check that these dependencies are all listed in your package.json.  

**devDependencies**:
 - husky 8.0.2
 - jest: 27.5.1
 - jest-sorted: 1.0.14
 - jest-extended: 2.0.0
- supertest: 6.3.3

**dependecies**:
 - dotenv: 16.0.0
 - express: 4.18.2
 - pg: 8.7.3
 - pg-format: 1.0.4
 
 <br>



4. **Set up Database**: Run the following command in your terminal to set up connection to the database: 

``` 
npm run setup-dbs
```

5. **Seed the Database**: Run the following command in your temrinal to seed the database: 
```
npm run seed
```

You should receive a seed **successfully complete**. If you wish to add data to the seed files, make sure that they conform to the schemas which can be found in the models folder.

## API endpoints

Once you have installed and set up the project, you may view the API endpoints in your browser on http://localhost:9090. For example, http://localhost:9090/api/articles will return all of the articles. Below is a list of all available endpoints.

The endpoints availbale for this API are: 

| **Endpoint**                        	| **Request Type** 	| **Description**                                                           	| **Functionality**                                               	|
|-------------------------------------	|------------------	|---------------------------------------------------------------------------	|-----------------------------------------------------------------	|
| /api                                	| GET              	| Serves up a json representation of all the available endpoints of the api 	|                                                                 	|
| /api/topics                         	| GET              	| Serves an array of all topics                                             	|                                                                 	|
| /api/articles                       	| GET              	| Serves an array of all articles.                                          	| This endpoint is queryable by author, topic, sort by and order. 	|
| /api/articles/:article_id           	| GET PATCH DELETE 	| Returns one article including comment count when given a valid id.        	| Votes on an article can be increment and decremented.           	|
| /api/articles/:article_id/comments 	| PATCH DELETE     	| Returns an array of comments when given a valid id.                       	| Comments can be posted and deleted.                             	|
| /api/users                          	| GET              	| Serves an array of all users                                              	|                                                                 	|


#### For a comprehensive list of enpoints and their variables please see the "api/" route

<br>

## Running Tests

To run tests, open a terminal, navigate to the project folder and run

```
npm test
```

## Scripts


To connect to the local server:
The local server port for this project has been set to 9090.

```
npm start
```




