"use client";

import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

export const LoginButton = () => {
    return (
        <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => signIn()}>
            Sign in
        </button>
    );
};

export const RegisterButton = () => {
    return (
        <Link href="/register" style={{ marginRight: 10 }}>
            Register
        </Link>
    );
};

export const LogoutButton = () => {
    return (
        <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => signOut()}>
            Sign Out
        </button>
    );
};

export const ProfileButton = () => {
    return <Link href="/profile">Profile</Link>;
};