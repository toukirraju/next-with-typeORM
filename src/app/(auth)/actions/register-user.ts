"use server";

import { AppDataSource } from "@/config/data-source";
import { initializeDatabase } from "@/config/db";
import { User, UserRole } from "@/entities/User";
import { validate } from "class-validator";
import bcrypt from "bcryptjs";
import { generateTokens } from "@/app/(auth)/actions/token";

export type ValidationErrorDetails = {
    property: string;
    constraints: Record<string, string>;
};

export type RegisterActionState = {
    error: string | null;
    success: boolean;
    details?: ValidationErrorDetails[];
};

export async function registerUser(
    prevState: RegisterActionState | undefined,
    formData: FormData
): Promise<RegisterActionState> {
    try {
        const user = new User();
        user.email = formData.get("email") as string;
        user.password = formData.get("password") as string;
        user.name = formData.get("name") as string;
        user.phone = formData.get("phone") as string;
        user.role = (formData.get("role") as UserRole) || UserRole.GENERAL_USER;

        const errors = await validate(user);
        if (errors.length > 0) {
            const serializedErrors: ValidationErrorDetails[] = errors.map((error) => ({
                property: error.property,
                constraints: error.constraints || {},
            }));
            return { error: "Validation failed", success: false, details: serializedErrors };
        }

        await initializeDatabase();
        const userRepository = AppDataSource.getRepository(User);

        const existingUser = await userRepository.findOneBy({ email: user.email });
        if (existingUser) {
            return { error: "User already exists", success: false };
        }

        user.password = await bcrypt.hash(user.password, 10);
        await userRepository.save(user);

        const tokens = generateTokens({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        await userRepository.update(user.id, { refreshToken: tokens.refreshToken });

        return { error: null, success: true };
    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Failed to register user", success: false };
    }
}