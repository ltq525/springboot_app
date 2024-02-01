export default {
    state: {
        is_record: false,
        a_steps: "",
        b_steps: "",
        record_loser: "",
    },
    getters: {

    },
    mutations: { // 同步操作, 允许一起执行放在mutations中
        updateIsRecord(state, is_record) {
            state.is_record = is_record;
        },
        updateSteps(state, data) {
            state.a_steps = data.a_steps;
            state.b_steps = data.b_steps;
        },
        updateRecordLoser(state, loser) {
            state.record_loser = loser;
        }
    },
    actions: { // 异步操作, 需要按步执行放在actions中
  
    },
    modules: {
    }
}
