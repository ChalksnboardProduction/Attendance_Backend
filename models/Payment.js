import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Plans_Payment_Info = sequelize.define('PlansPaymentInfo', {
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'school_users', // Referencing the 'school_users' table's 'id' column
      key: 'id'
    }
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'INR' // Default currency is INR
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW // Default payment date is the current date and time
  }
}, {
  freezeTableName: true // Prevents Sequelize from pluralizing the table name
});

export default Plans_Payment_Info;
