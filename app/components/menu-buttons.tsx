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
import { TransactionClass } from "../models/Transaction";
import { IconButton } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { DeleteCategory, DeleteIncome, DeleteTransaction } from "./delete-items-server";
import EditIcon from '@mui/icons-material/Edit';
import { Dispatch, SetStateAction } from "react";
import { Income, IncomeClass } from "../models/Income";
import { CategoryClass } from "../models/Category";

type transactionItemMenuProps = {
    transaction: TransactionClass;
    isEditingTransaction: boolean;
    setIsEditingTransaction: Dispatch<SetStateAction<boolean>>;
};

type incomeItemMenuProps = {
    income: IncomeClass;
    isEditingIncome: boolean;
    setIsEditingIncome: Dispatch<SetStateAction<boolean>>;
};

type categoryItemMenuProps = {
    category: CategoryClass;
    isEditingCategory: boolean;
    setIsEditingCategory: Dispatch<SetStateAction<boolean>>;
};

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
                <MenuItem onClick={handleClose}>
                    <Link href="/savings">Savings</Link>
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

export function TransactionItemMenu({ transaction, isEditingTransaction, setIsEditingTransaction }: transactionItemMenuProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div>
            <IconButton
                aria-label="more"
                id="transaction-more-button"
                aria-controls={open ? 'transaction-Item-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
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
                    <EditIcon>
                        <Logout fontSize="small" />
                    </EditIcon>
                    <button onClick={() => setIsEditingTransaction(true)}>
                        Edit Transaction
                    </button>
                </MenuItem>

                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <DeleteTransaction transaction={transaction} />
                </MenuItem>
            </Menu>
        </div>
    )
}

export function IncomeItemMenu({ income, isEditingIncome, setIsEditingIncome }: incomeItemMenuProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div>
            <IconButton
                aria-label="more"
                id="income-more-button"
                aria-controls={open ? 'income-Item-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
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
                    <EditIcon>
                        <Logout fontSize="small" />
                    </EditIcon>
                    <button onClick={() => setIsEditingIncome(true)}>
                        Edit Income
                    </button>
                </MenuItem>

                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <DeleteIncome income={income} />
                </MenuItem>
            </Menu>
        </div>
    )
}

export function CategoryItemMenu({ category, isEditingCategory, setIsEditingCategory }: categoryItemMenuProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div>
            <IconButton
                aria-label="more"
                id="income-more-button"
                aria-controls={open ? 'income-Item-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
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
                    <EditIcon>
                        <Logout fontSize="small" />
                    </EditIcon>
                    <button onClick={() => setIsEditingCategory(true)}>
                        Edit Category
                    </button>
                </MenuItem>

                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <DeleteCategory category={category} userId={""} />
                </MenuItem>
            </Menu>
        </div>
    )
}