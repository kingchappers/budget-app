import { getOldestOrNewestTransaction } from "../lib/transaction-db"
import { IncomeFilter, getOldestOrNewestIncome } from "../lib/income-db"
import { TransactionFilter } from "../lib/transaction-db"

export async function getOldestAndNewestTransactions(filter: TransactionFilter){
    const oldestTransaction = await getOldestOrNewestTransaction(filter, true);
    const newestTransaction = await getOldestOrNewestTransaction(filter, false);

    return {
        oldestTransaction,
        newestTransaction
    }
}

export async function getOldestAndNewestIncomes(filter: IncomeFilter){
    const oldestIncome = await getOldestOrNewestIncome(filter, true);
    const newestIncome = await getOldestOrNewestIncome(filter, false);

    return {
        oldestIncome,
        newestIncome
    }
}