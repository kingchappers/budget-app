import { deleteIncomeAction, updateIncomeAction } from "../_incomeActions"
import CheckBox from "./checkbox";
import { IncomeClass } from "../models/Income";
import DeleteIncome from "./delete-income-item-server";

interface IncomeItemProps {
    income: IncomeClass
}

const IncomeItem: React.FC<IncomeItemProps> = ({ income }) => {
    function handleClick() {
        console.log('increment like count');
      }

    return(
        <tbody>
            <tr>
                    <td className="px-5">{income.incomeDate}</td>
                    <td className="px-5">{income.company}</td>
                    <td className="px-5">{income.amount}</td>
                    <td className="px-5">{income.incomeCategory}</td>
                    <td className="px-5">{income.notes}</td>
                    <td><DeleteIncome income={income}/></td>
            </tr>
        </tbody>
    );
};

export default IncomeItem;