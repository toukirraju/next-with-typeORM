"use server";

import { AppDataSource } from "@/config/data-source";
import { initializeDatabase } from "@/config/db";
import { User } from "@/entities/User";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/utils/authOptions";

async function getUsers() {
    await initializeDatabase();
    const userRepository = AppDataSource.getRepository(User);
    return userRepository.find({
        where: { role: "general_user" as User["role"] }
    });
}

export default async function UsersListPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const allowedRoles = ["regular_admin", "super_admin"];
    if (!allowedRoles.includes(session.user.role)) {
        redirect("/auth/error?error=AccessDenied");
    }

    const users = await getUsers();

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Users List</h1>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Role</th>
                        <th className="border p-2">Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-t">
                            <td className="border p-2">{user.id}</td>
                            <td className="border p-2">{user.name}</td>
                            <td className="border p-2">{user.email}</td>
                            <td className="border p-2">{user.role}</td>
                            <td className="border p-2">{user.phone || "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link
                href="/dashboard"
                className="mt-4 inline-block bg-blue-500 text-white p-2 rounded"
            >
                Back to Dashboard
            </Link>
        </div>
    );
}