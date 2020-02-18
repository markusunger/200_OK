/* eslint-disable */

// execute from shell with
// mongo <server-ip>:<server-port> mongoTestDataScript.js 

// set global db variable
db = new Mongo('192.168.2.135').getDB('200ok');

// get example collection for 'envious-tesla' API and resource users
var collection = db.getCollection('envious-tesla?users');

// bulk insert a bunch of data
collection.bulkWrite([
  {
    insertOne: {
      document: {
        id: 1,
        path: 'users',
        name: 'Schaulustiger',
        mail: 'markus@unger.dev',
        isAdmin: true
      }
    }
  },
  {
    insertOne: {
      document: {
        id: 2,
        path: 'users',
        name: 'Jonathan',
        mail: 'johnathan@email.com',
        isAdmin: false
      }
    },
  },
  {
    insertOne: {
      document: {
        id: 3,
        path: 'users',
        name: 'Kiri',
        mail: 'kiri@wildemount.com',
        isAdmin: false
      }
    },
  },
  {
    insertOne: {
      document: {
        id: 1,
        path: 'users/1/comments',
        title: 'The first comment',
        text: 'This is the first comment for the user with id = 1'
      }
    },
  },
  {
    insertOne: {
      document: {
        id: 2,
        path: 'users/1/comments',
        title: 'The second comment',
        text: 'This is the second comment for the user with id = 1'
      }
    },
  },
  {
    insertOne: {
      document: {
        id: 3,
        path: 'users/1/comments',
        title: 'The third comment',
        text: 'This is the third comment for the user with id = 1'
      }
    },
  },
  {
    insertOne: {
      document: {
        id: 1,
        path: 'users/2/comments',
        title: 'The first comment',
        text: 'This is the first comment for the user with id = 2'
      }
    }
  },
]);