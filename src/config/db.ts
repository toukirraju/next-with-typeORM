import { AppDataSource } from "./data-source";

let initializationPromise: Promise<void> | null = null;

export async function initializeDatabase() {
    if (AppDataSource.isInitialized) {
        console.log("Database already initialized");
        return;
    }

    if (initializationPromise) {
        console.log("Database initialization already in progress");
        return initializationPromise;
    }

    try {
        console.log("Attempting to initialize database...");
        initializationPromise = AppDataSource.initialize().then(() => {
            console.log("Database connected successfully");
            console.log("Registered entities:", AppDataSource.entityMetadatas.map((meta) => meta.name));
        });
        await initializationPromise;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Detailed database connection error:", {
                message: error.message,
                name: error.name,
                stack: error.stack,
            });
        } else {
            console.error("Detailed database connection error:", error);
        }
        initializationPromise = null; // Reset on failure
        throw error;
    }
}