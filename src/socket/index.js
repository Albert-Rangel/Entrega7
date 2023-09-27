import messagesEvents from "./messagesEvents.js"
import produtsEvents from "./productsEvents.js"

const socketEvents = (socketServer) =>{
    messagesEvents(socketServer);
    produtsEvents(socketServer)
}

export default socketEvents
