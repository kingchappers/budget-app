import {
    ModelOptions,
    Severity,
    getModelForClass,
    index,
    post,
    prop,
} from "@typegoose/typegoose"
import mongoose from "mongoose"

@post<SavingClass>("save", function (doc) {
    if (doc) {
        doc.id = doc._id.toString();
        doc._id = doc.id;
    }
})
@post<SavingClass[]>(/^find/, function (docs) {
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
        collection: "savings",
    },
    options: {
        allowMixed: Severity.ALLOW,
    },
})
@index({ vendor: 1 })
class SavingClass {

    @prop({ required: true })
    monthStart: Date;

    @prop({ required: true })
    value: number;

    @prop({required: true})
    userId: string;

    _id: mongoose.Types.ObjectId | string;

    id: string;
}

const Saving = getModelForClass(SavingClass);
export { Saving, SavingClass };