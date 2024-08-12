import mongoose from "mongoose";
export const connectDB = async (uri) => {
    mongoose
        .connect(uri, {
        dbName: "SkillSnap Test",
    })
        .then((c) => console.log(`Connected to ${c.connection.host}`))
        .catch((err) => console.error(err));
};
