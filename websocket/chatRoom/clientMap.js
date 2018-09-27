/**
 *  这里是存放 用户名 与其对应的 socket.id
 */
export default new class  clientMap {
    constructor(){
        this.map = {
            // username : socket.id
        }
    }

    getClientByUid(username){
        return this.map[username]
    }
     getClients(){
        return this.map
    }
    addClient(username, id){
        this.map[username] = id
    }

}