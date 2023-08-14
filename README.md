# Northcoders News API

Getting Started

1. You will need to fork and clone this repository. Clone this repository by running the following command in your terminal: `git clone https://github.com/Lex5mith/Northcoders-News.git`

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
`npm install`
 
This will install the following dependencies: 

 - husky 8.0.2
 - jest: 27.5.1
 - jest-extended: 2.0.0
 - pg-format: 1.0.4
 - dotenv: 16.0.0
 - pg: 8.7.3

4. Set up Database: Run the following command in your terminal to set up connection to the database: 
`npm run setup-dbs`

5. Seed the Database: Run the following command in your temrinal to seed the database: 
`npm run seed`

You should receive a seed successfully complete. If you wish to add data to the seed files, make sure that they conform to the schemas which can be found in the models folder.








