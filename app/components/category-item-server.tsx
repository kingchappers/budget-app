import { IncomeCategoryCheckBox, TransactionCategoryCheckBox } from "./checkboxes";
import { CategoryClass } from "../models/Category";
import { DeleteCategory } from "./delete-items-server";

interface CategoryItemProps {
    category: CategoryClass;
    userId: string;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({ category, userId }) => {
    return (
        <tbody>
            <tr>
                <td className="px-5">{category.label}</td>
                <td className="text-center"><TransactionCategoryCheckBox category={category} /></td>
                <td className="text-center"><IncomeCategoryCheckBox category={category} /></td>
                <td><DeleteCategory category={category} userId={userId} /></td>
            </tr>
        </tbody>
    );
};
