<template>
    <div ref="parent" class="gamemap">
        // tabindex键盘输入操作
        <canvas ref="canvas" tabindex="0"></canvas>
    </div>
</template>

<script>
import { GameMap }  from "@/assets/scripts/GameMap"
import { ref, onMounted } from "vue";
import { useStore } from "vuex";

export default {
    setup() {
        const store = useStore();
        let parent = ref(null);
        let canvas = ref(null);
        
        // 服务器在渲染期间不会调用此函数
        onMounted(() => {
            store.commit(
                "updateGameObject",
                new GameMap(canvas.value.getContext('2d'), parent.value, store)
            );
        });

        return {
            parent,
            canvas
        }
    }
}

</script>

<style scoped>
div.gamemap {
    height: 100%;
    width: 100%;
    display: flex;
    /* 水平居中 */
    justify-content: center;
    /* 竖直居中 */
    align-items: center;
}

div.gamemap > canvas {
    position: absolute;
    /* 水平居中 */
    justify-content: center;
    /* 竖直居中 */
    align-items: center;
}

</style>