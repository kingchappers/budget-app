import { IncomeClass } from "../models/Income";
import DeleteIncome from "./delete-income-item-server";
import { dateToString } from "../lib/utils";


interface IncomeItemProps {
    income: IncomeClass
}

const IncomeItem: React.FC<IncomeItemProps> = ({ income }) => {
    const incomeDateString = dateToString(income.incomeDate)
    return(
        <tbody>
            <tr>
                    <td className="px-5">{incomeDateString}</td>
                    <td className="px-5">{income.company}</td>
                    <td className="px-5">£{income.amount.toFixed(2)}</td>
                    <td className="px-5">{income.incomeCategory}</td>
                    <td className="px-5">{income.notes}</td>
                    <td><DeleteIncome income={income}/></td>
            </tr>
        </tbody>
    );
};

export default IncomeItem;