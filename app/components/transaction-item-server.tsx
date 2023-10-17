import { TransactionClass } from "../models/Transaction";
import { DeleteTransaction } from "./delete-items-server";
import { dateToString } from "../lib/utils";

interface TransactionItemProps {
    transaction: TransactionClass
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
    const transactionDateString = dateToString(transaction.transactionDate)
    return (
        <tbody>
            <tr>
                <td className="px-5">{transactionDateString}</td>
                <td className="px-5">{transaction.vendor}</td>
                <td className="px-5">£{transaction.value.toFixed(2)}</td>
                <td className="px-5">{transaction.category}</td>
                <td className="px-5">{transaction.items}</td>
                <td className="px-5">{transaction.notes}</td>
                <td><DeleteTransaction transaction={transaction} /></td>
            </tr>
        </tbody>
    );
};
