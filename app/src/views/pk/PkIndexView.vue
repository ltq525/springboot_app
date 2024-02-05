<template>
    <PlayGround v-if="$store.state.pk.status === 'playing'"></PlayGround>
    <MatchGround v-if="$store.state.pk.status === 'matching'"></MatchGround>
    <ResultBoard v-if="$store.state.pk.loser !== 'none'"></ResultBoard>
    <div class="user-color" v-if="$store.state.pk.status === 'playing' && $store.state.user.id == $store.state.pk.a_id">
        <div>
            蓝色:&nbsp;&nbsp; <img :src="$store.state.user.photo" alt=""> {{ $store.state.user.username }}
            &nbsp;&nbsp;VS&nbsp;&nbsp;
            粉色:&nbsp;&nbsp; <img :src="$store.state.pk.opponent_photo" alt=""> {{ $store.state.pk.opponent_username }}
        </div>
    </div>
    <div class="user-color" v-if="$store.state.pk.status === 'playing' && $store.state.user.id == $store.state.pk.b_id">
        <div>
            蓝色:&nbsp;&nbsp; <img :src="$store.state.pk.opponent_photo" alt=""> {{ $store.state.pk.opponent_username }}
            &nbsp;&nbsp;VS&nbsp;&nbsp;
            粉色:&nbsp;&nbsp; <img :src="$store.state.user.photo" alt=""> {{ $store.state.user.username }}
        </div>
    </div>
</template>

<script>
import PlayGround from '@/components/PlayGround'
import MatchGround from '@/components/MatchGround';
import ResultBoard from '@/components/ResultBoard'
import { onMounted, onUnmounted } from "vue";
import { useStore } from 'vuex';

export default {
    components: {
        PlayGround,
        MatchGround,
        ResultBoard,
    },
    setup() {
        const store = useStore();
        const socketUrl = `ws://47.113.218.189:3000/websocket/${store.state.user.token}`;

        let socket = null;
        onMounted(() => {
            store.commit('updateOpponent', {
                username: "对手",
                photo: "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png",
            })

            store.commit("updateIsRecord", false);

            socket = new WebSocket(socketUrl);

            socket.onopen = () => {
                console.log("connected!");
                store.commit("updateSocket", socket);
            }
            socket.onmessage = (msg) => {
                const data = JSON.parse(msg.data);
                if (data.event === "matching-success") {  // 匹配成功
                    store.commit("updateOpponent", {
                        username: data.opponent_username,
                        photo: data.opponent_photo,
                    });
                    setTimeout(() => {
                        store.commit("updateStatus", "playing");
                    }, 300);

                    store.commit("updateGame", data.game);
                } else if (data.event === "move") {
                    const game = store.state.pk.gameObject;
                    const [snake0, snake1] = game.snakes;
                    snake0.set_direction(data.a_direction);
                    snake1.set_direction(data.b_direction);
                } else if (data.event === "result") {
                    const game = store.state.pk.gameObject;
                    const [snake0, snake1] = game.snakes;

                    if (data.loser === "all" || data.loser === "A") {
                        snake0.status = "die";
                    }
                    if (data.loser === "all" || data.loser === "B") {
                        snake1.status = "die";
                    }
                    store.commit("updateLoser", data.loser);
                }

            }
            socket.onclose = () => {
                console.log("disconnected!");
            }
        });

        onUnmounted(() => {
            socket.close();
            store.commit("updateLoser", "none");
            store.commit("updateStatus", "matching");
        })
    }
}

</script>

<style scoped>
div.user-color {
    text-align: center;
    color: white;
    font-size: 30px;
    font-weight: 600;
}

img {
    /* border-radius: 50%; */
    width: 8vh;
}
</style>
