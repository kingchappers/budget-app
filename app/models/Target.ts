import {
    ModelOptions,
    Severity,
    getModelForClass,
    index,
    post,
    prop,
} from "@typegoose/typegoose"
import mongoose from "mongoose"

@post<TargetClass>("save", function (doc) {
    if (doc) {
        doc.id = doc._id.toString();
        doc._id = doc.id;
    }
})
@post<TargetClass[]>(/^find/, function (docs) {
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
        collection: "targets",
    },
    options: {
        allowMixed: Severity.ALLOW,
    },
})
@index({ label: 1 })
class TargetClass {

    @prop({ required: true })
    categoryName: string;

    @prop({ default: true })
    targetAmount: number;

    @prop({ default: true })
    expenseTarget: boolean;

    @prop({ required: true })
    userId: string;

    _id: mongoose.Types.ObjectId | string;

    id: string;
}

const Target = getModelForClass(TargetClass);
export { Target, TargetClass };