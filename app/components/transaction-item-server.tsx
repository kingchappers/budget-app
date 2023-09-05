import { deleteTransactionAction, updateTransactionAction } from "../_actions";
import CheckBox from "./checkbox";
import { TransactionClass } from "../models/Transaction";

interface TransactionItemProps {
    transaction: TransactionClass
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
    return(
        <form className="flex items-center space-x-2 mb-2">
            <p className={"px-2 py-1 flex-1 text-left"}>{transaction.transactionDate}</p>
            <button
                className={`px-2 py-1 flex-1 text-left} ${
                    transaction.completed ? "line-through" : ""
                }`}
                formAction={async () => {
                    "use server";
                    await updateTransactionAction(transaction.id, { completed: !transaction.completed }, "/");
                }}
                >
                    {transaction.vendor}
            </button>

            <p className={"px-2 py-1 flex-1 text-left"}>{transaction.value}</p>

            <p className={"px-2 py-1 flex-1 text-left"}>{transaction.category}</p>

            <p className={"px-2 py-1 flex-1 text-left"}>{transaction.items}</p>

            <p className={"px-2 py-1 flex-1 text-left"}>{transaction.notes}</p>

            <div className="flex items-center">
                <CheckBox transaction={transaction} />
                <button className="px-2 py-1 ml-2 text-white rounded bg-red-500"
                formAction={async () => {
                    "use server";
                    await deleteTransactionAction({
                        id: transaction.id,
                        path: "/",
                    });
                }}
                >
                    Delete
                </button>
            </div>
        </form>
    );
};

export default TransactionItem;