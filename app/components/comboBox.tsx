"use client"

import React, { useTransition } from 'react';
import Select from 'react-select';
import { getCategories } from '../lib/categories-db';
import { getCategoriesAction } from '../_categoryActions';
import { CategoryClass } from '../models/Category';

// type CategoryComboBoxProps = {
//     category: CategoryClass
// }

interface CategoriesComboProps {
  categories: CategoryClass[];
};

export function CategoryComboBox({categories}: CategoriesComboProps) {
    const [isPending, startTransition] = useTransition();
    //const { categories, results } = getCategoriesAction

    // interface CategoryItemProps {
    //     selectedCategory: CategoryClass | null
    // }

    // const [state, setState] = React.useState<CategoryItemProps>({
    //     selectedCategory: null,
    //   });

    // const options = categories?.map((category: { id: any; label: any; }) => ({
    //     value: category.id,
    //     label: category.label,
    //   }));
    // for(const category of categories) {
    //   console.log("j")
    //   const options = {
    //     value: category.id,
    //     label: category.label
    //   }
    // }

    const categoryList = categories.map((category) => ({
      value: category.label,
      label: category.label
    }))

      return(
        <Select
        // If you don't need a state you can remove the two following lines value & onChange
        // value={state.selectedCategory}
        // onChange={(option: CategoryClass | null) => {
        //   setState({ selectedCategory: option });
        // }}
        // getOptionLabel={(category: CategoryClass) => category.label}
        // getOptionValue={(category: CategoryClass) => category.label}
        name = "CategoryCombobox"
        options={categoryList}
        isClearable={true}
        backspaceRemovesValue={true}
        classNames={{control: () => "w-44"}}
      />
      )
}


// //Below is a working examle with vehicles

// interface Vehicle {
//   id: number;
//   make: string;
//   model: string;
//   year: number;
// }

// interface ArrayObjectSelectState {
//   selectedVehicle: Vehicle | null;
// }

// const vehicles: Vehicle[] = [
//   {
//     id: 1,
//     make: 'Ford',
//     model: 'Fiesta',
//     year: 2003,
//   },
//   // I hope that you did let the two dots on purpose
//   // .
//   // .
//   {
//     id: 7,
//     make: 'Audi',
//     model: 'A4',
//     year: 2009,
//   },
// ];

// export default function VehiclePicker() {
//   // I changed the position of the state here, that's how you should use the state in react
//   // https://reactjs.org/docs/hooks-state.html#declaring-a-state-variable

//   // If you don't need a state you can remove the following line
//   const [state, setState] = React.useState<ArrayObjectSelectState>({
//     selectedVehicle: null,
//   });

//   return (
//     <div className="vehicle-picker">
//       <Select
//         // If you don't need a state you can remove the two following lines value & onChange
//         value={state.selectedVehicle}
//         onChange={(option: Vehicle | null) => {
//           setState({ selectedVehicle: option });
//         }}
//         getOptionLabel={(vehicle: Vehicle) => vehicle.model}
//         getOptionValue={(vehicle: Vehicle) => vehicle.model}
//         options={vehicles}
//         isClearable={true}
//         backspaceRemovesValue={true}
//       />
//     </div>
//   );
// }
