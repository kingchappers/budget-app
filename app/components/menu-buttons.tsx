"use client"

import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import { signIn, signOut } from "next-auth/react";

export function BudgetMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                className="hover:bg-slate-200"
            >
                Budget ▼
            </button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleClose}>
                    <Link href="/category">Configure Categories</Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Link href="/targets">Targets</Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Link href="/variance">Variance</Link>
                </MenuItem>
            </Menu>
        </div>
    );
}

export function AccountMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                className="hover:bg-slate-200"
            >
                Account ▼
            </button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleClose}>
                    <button onClick={() => signIn()}>
                        Sign in
                    </button>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <button onClick={() => signOut()}>
                        Sign Out
                    </button>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Link href="/register">Register</Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Link href="/api/session">Get Session Info</Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Link href="/profile">Profile</Link>
                </MenuItem>
            </Menu>
        </div>
    );
}