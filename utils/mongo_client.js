import mongoose from "mongoose";

class MongoDbClient {
constructor(){
this.client = mongoose;
}
async initClient() {
    await this.client.connect(process.env.MONGODB_URL, {
    });
    return this.client;
}

async disconnectClient() {
    await this.client.disconnect();
}
}

export default MongoDbClient