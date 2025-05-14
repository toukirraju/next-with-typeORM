"use server";

import { AppDataSource } from "@/config/data-source";
import { initializeDatabase } from "@/config/db";
import { User, UserRole } from "@/entities/User";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/utils/authOptions";

async function getAdmins() {
    await initializeDatabase();
    const userRepository = AppDataSource.getRepository(User);
    return userRepository.find({
        where: [{ role: UserRole.REGULAR_ADMIN }, { role: UserRole.SUPER_ADMIN }],
    });
}

export default async function AdminsListPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    if (session.user.role !== "super_admin") {
        redirect("/auth/error?error=AccessDenied");
    }

    const admins = await getAdmins();

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Admins List</h1>
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
                    {admins.map((admin) => (
                        <tr key={admin.id} className="border-t">
                            <td className="border p-2">{admin.id}</td>
                            <td className="border p-2">{admin.name}</td>
                            <td className="border p-2">{admin.email}</td>
                            <td className="border p-2">{admin.role}</td>
                            <td className="border p-2">{admin.phone || "N/A"}</td>
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