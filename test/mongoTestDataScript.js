/* eslint-disable */

// execute from shell with
// mongo <server-ip>:<server-port> mongoTestDataScript.js 

// set global db variable
db = new Mongo('127.0.0.1').getDB('200ok');

// get example collection for 'envious-tesla' API and resource users
var collection = db.getCollection('envious-tesla?users');

// bulk insert a bunch of data
collection.bulkWrite([
  {
    insertOne: {
      document: {
        path: 'users',
        data: {
          name: 'Schaulustiger',
          mail: 'markus@unger.dev',
          isAdmin: true,
        }
      }
    }
  },
  {
    insertOne: {
      document: {
        path: 'users',
        data: {
          name: 'Jonathan',
          mail: 'johnathan@email.com',
          isAdmin: false
        }
      }
    },
  },
  {
    insertOne: {
      document: {
        path: 'users',
        data: {
          name: 'Kiri',
          mail: 'kiri@wildemount.com',
          isAdmin: false
        }
      }
    },
  },
  {
    insertOne: {
      document: {
        path: 'users/1/comments',
        data: {
          title: 'The first comment',
          text: 'This is the first comment for the user with id = 1'
        }
      }
    },
  },
  {
    insertOne: {
      document: {
        path: 'users/1/comments',
        data: {
          title: 'The second comment',
          text: 'This is the second comment for the user with id = 1'
        }
      }
    },
  },
  {
    insertOne: {
      document: {
        path: 'users/1/comments',
        data: {
          title: 'The third comment',
          text: 'This is the third comment for the user with id = 1'
        }
      }
    },
  },
  {
    insertOne: {
      document: {
        path: 'users/2/comments',
        data: {
          title: 'The first comment',
          text: 'This is the first comment for the user with id = 2'
        }
      }
    }
  },
]);