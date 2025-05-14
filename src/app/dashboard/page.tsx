"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { logout } from "@/app/(auth)/actions/logout";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            await signOut({ redirect: false });
            router.push("/");
        } else {
            console.error("Logout failed:", result.error);
        }
    };

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (!session) {
        return null;
    }

    const { user } = session;

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p>Welcome, {user.name} ({user.role})</p>
            <div className="space-y-2 mt-4">
                <Link href="/profile" className="block bg-blue-500 text-white p-2 rounded">
                    View Profile
                </Link>
                {["regular_admin", "super_admin"].includes(user.role) && (
                    <Link href="/admin/users" className="block bg-blue-500 text-white p-2 rounded">
                        View Users List
                    </Link>
                )}
                {user.role === "super_admin" && (
                    <Link href="/admin/admins" className="block bg-blue-500 text-white p-2 rounded">
                        View Admins List
                    </Link>
                )}
                <button
                    onClick={() => router.push("/")}
                    className="w-full bg-gray-500 text-white p-2 rounded"
                >
                    Home
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 text-white p-2 rounded"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}