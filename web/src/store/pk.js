export default {
    state: {
        status: "matching", // mathcing, playing
        socket: null,
        opponent_username: "",
        opponent_photo: "",
        game_map: null,
    },
    getters: {

    },
    mutations: { // 同步操作, 允许一起执行放在mutations中
        updateSocket(state, socket) {
            state.socket = socket;
        },
        updateOpponent(state, opponent) {
            state.opponent_username = opponent.username;
            state.opponent_photo = opponent.photo;
        },
        updateStatus(state, status) {
            state.status = status;
        },
        updateGamemap(state, game_map) {
            state.game_map = game_map;
        }

    },
    actions: { // 异步操作, 需要按步执行放在actions中
  
    },
    modules: {
    }
}
