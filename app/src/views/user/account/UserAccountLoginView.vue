<template>
    <ContentField v-if="!$store.state.user.pulling_info">
        <div class="row justify-content-md-center">
            <div class="col-3">
                <form @submit.prevent="login">
                    <div class="mb-3">
                        <label for="username" class="form-label">用户名</label>
                        <input v-model="username" type="text" class="form-control" id="username" placeholder="请输入用户名">
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">密码</label>
                        <input v-model="password" type="password" class="form-control" id="password" placeholder="请输入密码">
                    </div>
                    <div class="error-message"> {{ error_message }} </div>
                    <button type="submit" class="btn btn-primary">提交</button>
                </form>
                <div @click="Auth_login" style="text-align: center; margin-top: 20px; cursor: pointer;">
                    <img width="30px" src="https://ltq525.github.io/site/logo/logo.png" alt="">
                    <br>
                    一键授权登录
                </div>
            </div>
        </div>
    </ContentField>
</template>

<script>
import ContentField from '@/components/ContentField'
import { useStore } from 'vuex';
import { ref } from 'vue';
import router from '@/router/index';
import $ from 'jquery';

export default {
    components: {
        ContentField,
    },
    setup() {
        const store = useStore();
        let username = ref('');
        let password = ref('');
        let error_message = ref('');

        const jwt_token = localStorage.getItem("jwt_token");
        if(jwt_token) {
            // commit调用mutation里的函数
            store.commit("updateToken", jwt_token);
            // dispatch调用action里的函数
            store.dispatch("getinfo", {
                success() {
                    router.push({name: 'home'})
                    store.commit("updatePullinginfo", false);
                },
                error() {
                    store.commit("updatePullinginfo", false);
                },
            })
        } else {
            store.commit("updatePullinginfo", false);
        }

        const login = () => {
            error_message.value = "",
            store.dispatch("login", {
                username: username.value,
                password: password.value,
                success() {
                    store.dispatch("getinfo", {
                        success() {
                            router.push({ name: 'home' });
                        }
                        
                    });
                },
                error() {
                    error_message.value = "用户名或密码错误"
                },
            })
        }

        const Auth_login = () => {
            $.ajax({
                url: "http://47.113.218.189/api/user/account/acwing/web/apply_code/",
                type: "GET",
                success: resp => {
                    if (resp.result === "success") {
                        window.location.replace(resp.apply_code_url);
                    }
                }
            })
        }

        return {
            username,
            password,
            error_message,
            login,
            Auth_login,
        }
    }
}

</script>

<style scoped>
button {
    width: 100%;
}

.error-message {
    color: red;
}
</style>