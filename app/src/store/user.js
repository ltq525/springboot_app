import $ from 'jquery';

export default {
    state: {
        id: "",
        username: "",
        photo: "",
        token: "",
        is_login: false,
        pulling_info: true, // 是否正在从云端拉取信息
    },
    getters: {

    },
    mutations: { // 同步操作, 允许一起执行放在mutations中
        updateUser(state, user) {
            state.id = user.id;
            state.username = user.username;
            state.photo = user.photo;
            state.is_login = user.is_login;
        },
        updateToken(state, token) {
            state.token = token;
        },
        logout(state) {
            state.id = "";
            state.username = "";
            state.photo = "";
            state.token = "",
            state.is_login = false;
        },
        updatePullinginfo(state, pulling_info) {
            state.pulling_info = pulling_info;
        }

    },
    actions: { // 异步操作, 需要按步执行放在actions中
        login(context, data) {
            $.ajax({
                url: "http://47.113.218.189:3000/api/user/account/token/",
                type: "post",
                data: {
                    username: data.username,
                    password: data.password,
                },
                success(resp) {
                    if (resp.message === "success") {
                        localStorage.setItem("jwt_token", resp.token);
                        context.commit('updateToken', resp.token);
                        data.success(resp);
                    }
                    else {
                        data.error(resp);
                    }
                },
                error(resp) {
                    data.error(resp);
                }

            })
        },
        getinfo(context, data) {
            $.ajax({
                url: "http://47.113.218.189:3000/api/user/account/info/",
                type: 'get',
                headers: {
                    Authorization: "Bearer " + context.state.token,
                },
                success(resp) {
                    if (resp.message === "success") {
                        context.commit("updateUser", {
                            ...resp,
                            is_login: true,
                        });
                        data.success(resp);
                    } else {
                        data.error(resp);
                    }
                },
                error(resp) {
                    data.error(resp);
                },
            })
        },
        logout(context) {
            localStorage.removeItem("jwt_token");
            context.commit("logout");
        }
    },
    modules: {
    }
}
