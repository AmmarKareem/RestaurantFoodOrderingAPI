Ammar Kareem 101187864

IMPORTANT NOTE:
PLEASE USE database-initializer.js FILE FROM MY SUBMISSION.
DO NOT USE THE ONE GIVEN IN BASECODE BECAUSE I MADE CHANGES TO THE FILE

TO RUN THE CODE:
1)open terminal and start the mongo daemon using command: mongod --dbpath "C:\MongoFiles\data\db"
then open another terminal and enter:
2)npm install
Once installation is finished, you must initialize the database, enter:
3)node database-initializer
then to start the program enter:
4)node server.js
or
npm start

Then open up browser and go to following link:
http://localhost:3000/

Design decisions:
Did not use CSS as it was not mentioned on spec sheet
used router to seperate code making it cleaner
did not make seperate collection for orders. Instead added array of order objects to each user
data for 3 restaurants is stored in client side js


