import { AuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AppDataSource } from "@/config/data-source";
import { initializeDatabase } from "@/config/db";
import { User } from "@/entities/User";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { generateTokens, verifyRefreshToken, BackendTokens } from "@/app/(auth)/actions/token";


async function refreshToken(token: JWT): Promise<JWT> {
    try {
        const payload = verifyRefreshToken(token.backendTokens.refreshToken);

        await initializeDatabase();
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: parseInt(payload.userId) });

        if (!user || user.refreshToken !== token.backendTokens.refreshToken) {
            return { ...token, error: "RefreshAccessTokenError" };
        }

        const newTokens = generateTokens({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        await userRepository.update(user.id, { refreshToken: newTokens.refreshToken });

        console.log("\x1b[33m", "~~~~~~~~~~~~~~~~~~~Token refresh Complete~~~~~~~~~~~~~~~~~~~", "\x1b[0m");
        return {
            ...token,
            backendTokens: newTokens,
        };
    } catch (error) {
        console.log("\x1b[41m", "******************Error on refreshing token******************", "\x1b[0m");
        console.error(error);
        return { ...token, error: "RefreshAccessTokenError" };
    }
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    await initializeDatabase();
                    const userRepository = AppDataSource.getRepository(User);
                    const user = await userRepository.findOneBy({ email: credentials.email });

                    if (!user) {
                        throw new Error("User not found");
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isValid) {
                        throw new Error("Invalid password");
                    }

                    const tokens = generateTokens({
                        id: user.id,
                        email: user.email,
                        role: user.role,
                    });

                    await userRepository.update(user.id, { refreshToken: tokens.refreshToken });

                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        backendTokens: tokens,
                    };
                } catch (error) {
                    if (error instanceof Error) {
                        console.error("Authorize error:", {
                            message: error.message,
                            stack: error.stack,
                        });
                    } else {
                        console.error("Authorize error:", {
                            message: String(error),
                        });
                    }
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }): Promise<JWT> {
            if (user) {
                return { ...token, ...user };
            }

            if (Date.now() < token.backendTokens.expiresIn) {
                console.log("\x1b[42m", "token not expired");
                console.log("ExpireAt=> " + new Date(token.backendTokens.expiresIn).toLocaleString());
                console.log("Now=> " + new Date().toLocaleString(), "\x1b[0m");
                return token;
            }

            return await refreshToken(token);
        },
        async session({ session, token }) {
            session.user = {
                id: token.id,
                email: token.email,
                name: token.name,
                role: token.role,
            };
            session.backendTokens = token.backendTokens as BackendTokens;
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt" as SessionStrategy,
    },
};