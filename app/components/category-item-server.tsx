import { IncomeCategoryCheckBox, TransactionCategoryCheckBox } from "./checkboxes";
import { CategoryClass } from "../models/Category";
import DeleteCategory from "./delete-category-item-server";

interface CategoryItemProps {
    category: CategoryClass
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category }) => {
    return (
        <tbody>
            <tr>
                <td className="px-5">{category.label}</td>
                <td><TransactionCategoryCheckBox category={category} /></td>
                <td><IncomeCategoryCheckBox category={category} /></td>
                <td><DeleteCategory category={category} /></td>
            </tr>
        </tbody>
    );
};

export default CategoryItem;