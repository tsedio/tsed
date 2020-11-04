export default {
  id: "default",
  url: process.env.DEFAULT_URL || "mongodb://localhost:27017/example-mongoose-test",
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
};
