'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Travels', {
      id: { allowNull: false, primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
      judulPerjalanan: { type: Sequelize.STRING, allowNull: false },
      cerita: { type: Sequelize.TEXT, allowNull: false },
      imageId: { type: Sequelize.STRING, allowNull: false },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: 'Users', key: 'googleId' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Travels');
  }
};
