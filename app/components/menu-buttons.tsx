"use client"

import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import Login from '@mui/icons-material/Login';
import PersonAdd from "@mui/icons-material/PersonAdd";
import ManageAccounts from "@mui/icons-material/ManageAccounts";
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
                    <ListItemIcon>
                        <Login fontSize="small" />
                    </ListItemIcon>
                    <button onClick={() => signIn()}>
                        Sign in
                    </button>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    <button onClick={() => signOut()}>
                        Sign Out
                    </button>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    <Link href="/register">Register</Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Link href="/api/session">Get Session Info</Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <ManageAccounts fontSize="small" />
                    </ListItemIcon>
                    <Link href="/profile">Profile</Link>
                </MenuItem>
            </Menu>
        </div>
    );
}