import {
    ModelOptions,
    Severity,
    getModelForClass,
    index,
    post,
    prop,
} from "@typegoose/typegoose"
import mongoose from "mongoose"

@post<CategoryClass>("save", function (doc) {
    if (doc) {
        doc.id = doc._id.toString();
        doc._id = doc.id;
    }
})
@post<CategoryClass[]>(/^find/, function (docs) {
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
        collection: "category",
    },
    options: {
        allowMixed: Severity.ALLOW,
    },
})
@index({ label: 1 })
class CategoryClass {

    @prop({ required: true, unique: true })
    label: string;

    @prop({ default: true })
    transactionCategory: boolean;

    @prop({ default: true })
    incomeCategory: boolean;

    _id: mongoose.Types.ObjectId | string;

    id: string;
}

const Category = getModelForClass(CategoryClass);
export { Category, CategoryClass };