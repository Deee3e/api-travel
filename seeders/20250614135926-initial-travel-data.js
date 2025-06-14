'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up (queryInterface, Sequelize) {
    const userId = '123456789012345678901'; // ID unik bohongan
    await queryInterface.bulkInsert('Users', [{
      googleId: userId,
      displayName: 'Traveler Keren',
      email: 'traveler@example.com',
      image: 'https://i.pravatar.cc/150?u=traveler',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    await queryInterface.bulkInsert('Travels', [{
        id: uuidv4(),
        judulPerjalanan: 'Petualangan di Gunung Bromo',
        cerita: 'Melihat matahari terbit dari puncak adalah pengalaman yang tak terlupakan. Dinginnya udara terbayar dengan pemandangan yang spektakuler.',
        imageId: '/uploads/bromo.jpg',
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Travels', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
