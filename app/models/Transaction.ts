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
@index({ vendor: 1 })
class TransactionClass {

    @prop({default: false})
    checked: boolean;

    @prop({required: true})
    transactionDate: string;
    
    @prop({required: true})
    vendor: string;

    @prop({required: true })
    value: number;

    @prop({required: true, default: "Miscellaneous"})
    category: string;

    @prop({required: false})
    items: string;

    @prop({required: false})
    notes: string;
    
    _id: mongoose.Types.ObjectId | string;

    id: string;
}

const Transaction = getModelForClass(TransactionClass);
export { Transaction, TransactionClass};