1. 執行./config/library.sql內容建立3個talbe
2. 執行npm install
3. 執行node generateToken.js產生API接收端所需之TOKEN
4. 新建一個.env檔加入以下內容
   DB_HOST=<你的HOST NAME>
   DB_USER=<你的帳號>
   DB_PASSWORD=<你的密碼>
   DB_NAME=library

   API_TOKEN=<你的TOKEN>
5. 執行nodemon app.js
