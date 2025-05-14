import "reflect-metadata";
import { User } from "@/entities/User";
import { DataSource } from "typeorm";
import pg from "pg";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true, // Set to false in production
    // logging: true,
    entities: [User], // Explicitly list entities
    migrations: ["src/migrations/**/*.ts"],
    driver: pg,
});