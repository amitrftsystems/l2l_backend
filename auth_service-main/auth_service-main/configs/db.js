import { Sequelize } from "sequelize";
import { config } from "dotenv";

config();

// console.log(process.env.PG_URL);
export const sequelize = new Sequelize(process.env.PG_URL, {
  dialect: "postgres",
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully!");
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
  }
};
