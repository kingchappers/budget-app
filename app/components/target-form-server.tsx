import { TargetClass } from "../models/Target";
import DeleteCategory from "./delete-category-item-server";

interface TargetItemProps {
    target: TargetClass
}

const CategoryItem: React.FC<TargetItemProps> = ({ target }) => {
    return(
        <form>
            <label htmlFor="target">{target.categoryName}: </label>
            <input type="text" name="target" value={target.targetAmount} className="border rounded px-1 py-1 w-52" />
        </form>
    );
};

export default CategoryItem;
