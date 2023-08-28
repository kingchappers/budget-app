import {
    ModelOptions,
    Severity,
    getModelForClass,
    index,
    post,
    prop,
} from "@typegoose/typegoose"
import mongoose from "mongoose"

@post<TransactionClass>("save", function (doc) {
    if (doc) {
        doc.id = doc._id.toString();
        doc._id = doc.id;
    }
})
@post<TransactionClass[]>(/^find/, function (docs) {
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
        collection: "transactions",
    },
    options: {
        allowMixed: Severity.ALLOW,
    },
})
@index({ transactionVendor: 1})
class TransactionClass {
    // @prop({ required: true, unique: true })
    // title: string;

    // @prop({ default: false })
    // completed: boolean;

    @prop({required: true})
    transactionDate: string;
    
    @prop({required: true})
    transactionVendor: string;

    @prop({required: true })
    transactionValue: number;

    @prop({required: true, default: "Miscellaneous"})
    transactionCategory: string;

    @prop({required: false})
    transactionItems: string;

    @prop({required: false})
    transcationNotes: string;
    
    _id: mongoose.Types.ObjectId | string;

    id: string;
}

const Transaction = getModelForClass(TransactionClass);
export { Transaction, TransactionClass};