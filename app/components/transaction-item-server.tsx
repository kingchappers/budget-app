import { deleteTransactionAction, updateTransactionAction } from "../_actions";
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

        // <table>
        <tbody>
            <tr>
                    <td className="px-5">{transaction.transactionDate}</td>
                    <td className="px-5">{transaction.vendor}</td>
                    <td className="px-5">{transaction.value}</td>
                    <td className="px-5">{transaction.category}</td>
                    <td className="px-5">{transaction.items}</td>
                    <td className="px-5">{transaction.notes}</td>
                    <td className="px-5">{transaction.id}</td>
                    <td><DeleteTransaction transaction={transaction}/></td>
            </tr>
        </tbody>

        //      {/* <form className="flex items-center space-x-2 mb-2">
        //          <p className={"px-2 py-1 flex-1 text-left"}>{transaction.transactionDate}</p>

        //          <p className={"px-2 py-1 flex-1 text-left"}>{transaction.vendor}</p>

        //          <p className={"px-2 py-1 flex-1 text-left"}>{transaction.value}</p>

        //          <p className={"px-2 py-1 flex-1 text-left"}>{transaction.category}</p>

        //          <p className={"px-2 py-1 flex-1 text-left"}>{transaction.items}</p>

        //          <p className={"px-2 py-1 flex-1 text-left"}>{transaction.notes}</p>

        //          <div className="flex items-center">
        //              <CheckBox transaction={transaction} />
        //              <button className="px-2 py-1 ml-2 text-white rounded bg-red-500"
        //              formAction={async () => {
        //                  "use server";
        //                  await deleteTransactionAction({
        //                      id: transaction.id,
        // /                    path: "/",
        //                  });
        //              }}
        //              >
        //                  Delete
        //              </button>
        //          </div>
        //      </form> */}
    );
};

export default TransactionItem;