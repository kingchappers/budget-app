import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import { LoginButton, LogoutButton, ProfileButton, RegisterButton, } from './components/buttons.component';
import {AccountMenu, BudgetMenu} from "./components/menu-buttons"


const inter = Inter({ subsets: ['latin'] })
export const metadata = {
    title: 'Budget App',
    description: 'Generated by create next app',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>

            <body className="bg-slate-300">
                <header>
                    <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto p-4">
                        <Link className="mr-1" href="/">
                            <Image
                                src="/../public/images/fin-wide.png"
                                height={200}
                                width={200}
                                alt="samchapman.dev"
                                className="mr-3"
                            />
                        </Link>
                        <ul className="flex text-3xl mt-5">
                            <li className="ml-20 mr-9">
                                <BudgetMenu />
                            </li>
                            <li className="ml-20 mr-9">
                                <AccountMenu />
                            </li>
                            <li className="ml-20 mr-9">
                                <Link href="/">Home</Link>
                            </li>
                            <li className="mx-9">
                                <Link href="/about">About</Link>
                            </li>
                            <li className="mx-9">
                                <Link href="/help">Help</Link>
                            </li>
                            <li className="mx-9">
                                <Link href="/transactions">Transactions</Link>
                            </li>
                            <li className="mx-9">
                                <Link href="/income">Income</Link>
                            </li>
                            <li className="mx-9">
                                <Link href="/admin">Admin Page</Link>
                            </li>
                            <li>
                                <LoginButton />
                            </li>
                            <li>
                                <RegisterButton />
                            </li>
                            <li>
                                <LogoutButton />
                            </li>
                            <li>
                                <ProfileButton />
                            </li>
                            <li className="mx-9">
                                <Link href="/api/session">Get Session Info</Link>
                            </li>
                        </ul>
                    </div>
                </header>

                <main>
                    {children}
                </main>
            </body>
        </html>
    )
}
