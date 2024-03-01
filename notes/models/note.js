import mongoose from "mongoose"
import "dotenv/config"

mongoose.set("strictQuery", false)
const url = process.env.DB_URL

console.log("connecting to", url)

mongoose
  .connect(url)
  .then((res) => {
    console.log("connected to database")
  })
  .catch((err) => {
    console.log("error connecting to database")
  })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
const Note = mongoose.model("Note", noteSchema)
export default Note
