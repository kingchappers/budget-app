import { deleteTransactionAction, updateTransactionAction } from "../_transactionActions";
import CheckBox from "./checkbox";
import { TransactionClass } from "../models/Transaction";
import DeleteTransaction from "./delete-transaction-item-server";

interface TransactionItemProps {
    transaction: TransactionClass
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
    function handleClick() {
        console.log('increment like count');
      }

    return(
        <tbody>
            <tr>
                    <td className="px-5">{transaction.transactionDate}</td>
                    <td className="px-5">{transaction.vendor}</td>
                    <td className="px-5">{transaction.value}</td>
                    <td className="px-5">{transaction.category}</td>
                    <td className="px-5">{transaction.items}</td>
                    <td className="px-5">{transaction.notes}</td>
                    {/* <td className="px-5">{transaction.id}</td> */}
                    <td><DeleteTransaction transaction={transaction}/></td>
            </tr>
        </tbody>

    );
};

export default TransactionItem;