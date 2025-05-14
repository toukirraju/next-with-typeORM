"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { logout } from "@/app/(auth)/actions/logout";

export default function ProfilePage() {
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
            <h1 className="text-2xl font-bold mb-4">User Profile</h1>
            <div className="space-y-2">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
            </div>
            <div className="space-y-2 mt-4">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    Back to Dashboard
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