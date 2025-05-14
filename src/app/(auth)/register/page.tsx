"use client";

import { useActionState } from "react";
import { RegisterActionState, registerUser } from "../actions/register-user";

export default function RegisterPage() {
    const initialState: RegisterActionState = { error: null, success: false };
    const [state, formAction] = useActionState(registerUser, initialState);

    return (
        <div className="max-w-md mx-auto mt-10">
            <form action={formAction} className="space-y-4">
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        className="w-full border p-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className="w-full border p-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phone">Phone (Optional)</label>
                    <input
                        id="phone"
                        name="phone"
                        type="text"
                        className="w-full border p-2"
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        className="w-full border p-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="role">Role</label>
                    <select id="role" name="role" className="w-full border p-2">
                        <option value="general_user">General User</option>
                        <option value="regular_admin">Regular Admin</option>
                        <option value="super_admin">Super Admin</option>
                    </select>
                </div>
                {state.error && (
                    <div className="text-red-500">
                        <p>{state.error}</p>
                        {state.details && (
                            <ul>
                                {state.details.map((detail, index) => (
                                    <li key={index}>
                                        {Object.values(detail.constraints || {}).join(", ")}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
                {state.success && <p className="text-green-500">Registration successful!</p>}
                <button type="submit" className="w-full bg-blue-500 text-white p-2">
                    Register
                </button>
            </form>
        </div>
    );
}