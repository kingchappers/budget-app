import {
    ModelOptions,
    Severity,
    getModelForClass,
    index,
    post,
    prop,
} from "@typegoose/typegoose"
import mongoose from "mongoose"

export interface monthIncomeTotal {
    chartTitle: string;
    incomeType?: string;
    value: number;
    percentage: number;
}

@post<MonthlyIncomeClass>("save", function (doc) {
    if (doc) {
        doc.id = doc._id.toString();
        doc._id = doc.id;
    }
})
@post<MonthlyIncomeClass[]>(/^find/, function (docs) {
    // @ts-ignore
    if (this.op === "find") {
        docs.forEach((doc) => {
            doc.id = doc._id.toString();
            doc._id = doc.id;
        });
    }
})
@ModelOptions({
    schemaOptions: {
        timestamps: true,
        collection: "monthlyIncomes",
    },
    options: {
        allowMixed: Severity.ALLOW,
    },
})
@index({ vendor: 1 })
class MonthlyIncomeClass {

    @prop({ required: true })
    month: Date;

    @prop({ required: true })
    monthTotal: number;

    @prop({ required: true })
    monthIncomeTotals: monthIncomeTotal[];

    @prop({ required: true })
    userId: string;

    _id: mongoose.Types.ObjectId | string;

    id: string;
}

const MonthlyIncome = getModelForClass(MonthlyIncomeClass);
export { MonthlyIncome, MonthlyIncomeClass };