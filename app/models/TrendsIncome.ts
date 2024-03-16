import {
    ModelOptions,
    Severity,
    getModelForClass,
    index,
    post,
    prop,
} from "@typegoose/typegoose"
import mongoose from "mongoose"

@post<TrendsIncomeClass>("save", function (doc) {
    if (doc) {
        doc.id = doc._id.toString();
        doc._id = doc.id;
    }
})
@post<TrendsIncomeClass[]>(/^find/, function (docs) {
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
        collection: "trendsIncomes",
    },
    options: {
        allowMixed: Severity.ALLOW,
    },
})
@index({ vendor: 1 })
class TrendsIncomeClass {

    @prop({ required: true })
    month: Date;

    @prop({ required: true })
    monthTotal: number;

    @prop({required: true})
    userId: string;

    _id: mongoose.Types.ObjectId | string;

    id: string;
}

const TrendsIncome = getModelForClass(TrendsIncomeClass);
export { TrendsIncome, TrendsIncomeClass };