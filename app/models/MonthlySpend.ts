import {
    ModelOptions,
    Severity,
    getModelForClass,
    index,
    post,
    prop,
} from "@typegoose/typegoose"
import mongoose from "mongoose"

export interface monthSpendTotal {
    chartTitle: string;
    spendType?: string;
    value: number;
    percentage: number;
}

@post<MonthlySpendClass>("save", function (doc) {
    if (doc) {
        doc.id = doc._id.toString();
        doc._id = doc.id;
    }
})
@post<MonthlySpendClass[]>(/^find/, function (docs) {
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
        collection: "monthlySpends",
    },
    options: {
        allowMixed: Severity.ALLOW,
    },
})
@index({ vendor: 1 })
class MonthlySpendClass {

    @prop({ required: true })
    month: Date;

    @prop({ required: true })
    monthTotal: number;

    @prop({ required: true })
    monthSpendTotals: monthSpendTotal[];

    @prop({ required: true })
    userId: string;

    _id: mongoose.Types.ObjectId | string;

    id: string;
}

const MonthlySpend = getModelForClass(MonthlySpendClass);
export { MonthlySpend, MonthlySpendClass };