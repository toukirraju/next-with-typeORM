"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/utils/authOptions";
import { AppDataSource } from "@/config/data-source";
import { initializeDatabase } from "@/config/db";
import { User } from "@/entities/User";
import { getServerSession } from "next-auth/next";

export async function logout() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return { error: "Not authenticated", success: false };
    }

    try {
        await initializeDatabase();
        const userRepository = AppDataSource.getRepository(User);
        await userRepository.update(
            { id: parseInt(session.user.id) },
            { refreshToken: '' }
        );

        // Note: signOut is client-side, so we redirect after clearing the token
        return { error: null, success: true };
    } catch (error) {
        if (error instanceof Error) {
            console.error("Logout error:", {
                message: error.message,
                stack: error.stack,
            });
        } else {
            console.error("Logout error:", { error });
        }
        return { error: "Failed to logout", success: false };
    }
}