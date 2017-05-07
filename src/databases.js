import Sequelize from 'sequelize'

const postgres = new Sequelize(process.env.DATABASE_URL)

export const User = postgres.define(
  'User',
  {
    pennies_user_id: { type: Sequelize.STRING, primaryKey: true },
    monzo_token: Sequelize.JSONB,
    account_id: Sequelize.STRING,
    sheets_token: Sequelize.JSONB
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'User'
  }
)
