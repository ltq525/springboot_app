<template>
    <div></div>
</template>

<script>
import router from '@/router/index';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import $ from 'jquery';

export default {
    setup() {
        const route = useRoute();
        const store = useStore();

        $.ajax({
            url: "http://47.113.218.189/api/user/account/acwing/web/receive_code/",
            type: "GET",
            data: {
                code: route.query.code,
                state: route.query.state,
            },
            success: resp => {
                if (resp.result === "success") {
                    localStorage.setItem("jwt_token", resp.jwt_token);
                    store.commit('updateToken', resp.jwt_token);
                    router.push({ name: 'home' });
                    store.commit("updatePullinginfo", false);
                } else {
                    router.push({ name: 'user_account_login' });
                }
            }
        });

    }
}
</script>

<style scoped></style>