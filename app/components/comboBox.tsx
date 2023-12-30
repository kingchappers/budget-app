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
            classNamePrefix='Select'
            classNames={{ control: () => "w-36 lg:w-44 h-5 lg:h-10" }}
            placeholder="Category..."
            onChange={(choice) => setCategorySelection(choice)}
        />
    )
}