import './globals.css'
import Link from 'next/link'
import Image from 'next/image'
import { AccountMenu, BudgetMenu } from "./components/menu-buttons"
import { SpeedInsights } from "@vercel/speed-insights/next"

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
                    <div className="max-w-screen-2xl flex justify-center mx-auto p-4">
                        <Link className="mr-1" href="/">
                            <Image
                                src="/images/fin-wide.png"
                                height={200}
                                width={200}
                                alt="samchapman.dev"
                                className="mr-3"
                            />
                        </Link>
                        <ul className="flex text-2xl mt-5">
                            <li className="mx-5">
                                <BudgetMenu />
                            </li>
                            <li className="mx-5">
                                <AccountMenu />
                            </li>
                            <li className="mx-5">
                                <Link href="/utilities">Utilities</Link>
                            </li>
                            <li className="mx-5">
                                <Link href="/">Home</Link>
                            </li>
                            <li className="mx-5">
                                <Link href="/about">About</Link>
                            </li>
                            <li className="mx-5">
                                <Link href="/help">Help</Link>
                            </li>
                            <li className="mx-5">
                                <Link href="/transactions">Transactions</Link>
                            </li>
                            <li className="mx-5">
                                <Link href="/income">Income</Link>
                            </li>
                            <li className="mx-5">
                                <Link href="/admin">Admin Page</Link>
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
