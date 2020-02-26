const mongo = require('../../db/mongo');

module.exports = async () => {
  await mongo.init();

  await Promise.all([
    mongo.db.command({ drop: 'envious-tesla' }),
    mongo.db.command({ drop: 'config' }),
    mongo.db.command({ drop: 'idStore' }),
  ]);

  await Promise.all([
    mongo.db.collection('idStore').insertMany([
      {
        resource: 'envious-tesla:users',
        nextId: 5,
      }, {
        resource: 'envious-tesla:images',
        nextId: 3,
      },
      {
        resource: 'envious-tesla:users/1/comments',
        nextId: 3,
      },
    ]),
    mongo.db.collection('config').insertOne({
      subdomain: 'envious-tesla',
    }),
    mongo.db.collection('envious-tesla').insertMany([
      {
        path: 'users',
        createdAt: new Date(),
        data: {
          id: 1,
          name: 'Markus',
          isAdmin: true,
        },
      },
      {
        path: 'users',
        createdAt: new Date(),
        data: {
          id: 2,
          name: 'Bharat',
          isAdmin: true,
        },
      },
      {
        path: 'users',
        createdAt: new Date(),
        data: {
          id: 3,
          name: 'Deckard',
          isAdmin: false,
        },
      },
      {
        path: 'users',
        createdAt: new Date(),
        data: {
          id: 4,
          name: 'Tyrell',
          isAdmin: false,
        },
      },
      {
        path: 'users/1/comments',
        createdAt: new Date(),
        data: {
          id: 1,
          text: 'first comment',
        },
      },
      {
        path: 'users/1/comments',
        createdAt: new Date(),
        data: {
          id: 2,
          text: 'second comment',
        },
      },
      {
        path: 'images',
        createdAt: new Date(),
        data: {
          id: 1,
          url: '/images/first_image.png',
          width: 500,
          height: 300,
          isPublic: true,
        },
      },
      {
        path: 'images',
        createdAt: new Date(),
        data: {
          id: 1,
          url: '/images/second_image.png',
          width: 1200,
          height: 900,
          isPublic: false,
        },
      },
    ]),
  ]);
};
