import {
    ModelOptions,
    Severity,
    getModelForClass,
    index,
    post,
    prop,
} from "@typegoose/typegoose"
import mongoose from "mongoose"

@post<IncomeClass>("save", function (doc) {
    if (doc) {
        doc.id = doc._id.toString();
        doc._id = doc.id;
    }
})
@post<IncomeClass[]>(/^find/, function (docs) {
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
        collection: "income",
    },
    options: {
        allowMixed: Severity.ALLOW,
    },
})
@index({ vendor: 1 })
class IncomeClass {

    @prop({ required: true })
    incomeDate: Date;

    @prop({ required: true })
    company: string;

    @prop({ required: true })
    amount: number;

    @prop({ required: true, default: "Miscellaneous" })
    incomeCategory: string;

    @prop({ required: false })
    notes: string;

    _id: mongoose.Types.ObjectId | string;

    id: string;
}

const Income = getModelForClass(IncomeClass);
export { Income, IncomeClass };