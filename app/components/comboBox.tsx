"use client"

import React, { Dispatch, SetStateAction } from 'react';
import Select, { SingleValue } from 'react-select';
import { CategoryClass } from '../models/Category';

export interface CategoriesComboProps {
    categories: CategoryClass[];
    categoriesSelection?: string;
    setCategoriesSelection?: Dispatch<SetStateAction<string>>
};

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export function CategoryComboBox({ categories, categoriesSelection, setCategoriesSelection }: CategoriesComboProps) {

    const categoryList = categories.map((category) => ({
        value: category.label,
        label: category.label
    }))

    function setCategorySelection(choice: SingleValue<{ value: string; label: string; }>) {
        if (setCategoriesSelection) {
            if (choice) {
                setCategoriesSelection(choice.value)
            }
        }
    }

    return (
        <Select
            name="categoryCombobox"
            options={categoryList}
            isClearable={true}
            backspaceRemovesValue={true}
            classNames={{ control: () => "h-6 lg:h-10 w-28 lg:w-44" }}
            placeholder="Category..."
            onChange={(choice) => setCategorySelection(choice)}
        />
    )
}