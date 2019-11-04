# affluent_test
## Instalation

run npm install from  ```/```  ,  ```/get_and_insert_data/```  and  ```/show_data/```
```
npm install
```
## Getiing and inserting data

from  ```/get_and_insert_data/``` run:
```
node users.js
node dates.js
```
It will fetch the data from users api and affluent datatable using puppeteer.

## Database
Database is configured in ```/db_con.js```

## Showing data
From ```/show_data/``` run:
```
node app.js
```
Webpage will be accessible on ```http://localhost:8080/``` which sends xhr request to ```http://localhost:8080/api/v1/get_data```
