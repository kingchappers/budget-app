"use client"

import React, { useTransition } from 'react';
import Select from 'react-select';
import { getCategories } from '../lib/categories-db';
import { getCategoriesAction } from '../_categoryActions';
import { CategoryClass } from '../models/Category';

interface CategoriesComboProps {
  categories: CategoryClass[];
};

export function CategoryComboBox({categories}: CategoriesComboProps) {
    const [isPending, startTransition] = useTransition();

    const categoryList = categories.map((category) => ({
      value: category.label,
      label: category.label
    }))

      return(
        <Select
        name = "CategoryCombobox"
        options={categoryList}
        isClearable={true}
        backspaceRemovesValue={true}
        classNames={{control: () => "w-44"}}
      />
      )
}