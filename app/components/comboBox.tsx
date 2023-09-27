"use client"

import React, { useTransition } from 'react';
import Select from 'react-select';
import { CategoryClass } from '../models/Category';

export interface CategoriesComboProps {
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
        name = "categoryCombobox"
        options={categoryList}
        isClearable={true}
        backspaceRemovesValue={true}
        classNames={{control: () => "w-44"}}
      />
      )
}