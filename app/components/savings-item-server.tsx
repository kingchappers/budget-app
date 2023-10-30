import { SavingClass } from "../models/Savings";
import { dateToString } from "../lib/utils";

interface SavingItemProps {
    saving: SavingClass
}

export const SavingItem: React.FC<SavingItemProps> = ({ saving }) => {
    var monthDateString = dateToString(saving.monthStart)

    if(monthDateString == "01/01/2000"){
        monthDateString = "Initial Saving Value"
    }
    return (
        <tbody>
            <tr>
                <td className="text-center px-5">{monthDateString}</td>
                <td className="text-center px-5">£{saving.value.toFixed(2)}</td>
            </tr>
        </tbody>
    );
};
