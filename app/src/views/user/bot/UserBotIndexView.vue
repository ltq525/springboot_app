<template>
    <div class="container">
        <div class="row">
            <div class="col-3">
                <div class="card">
                    <div class="card-body">
                        <img :src="$store.state.user.photo" alt="" width="100%">
                    </div>
                </div>
            </div>
            <div class="col-9">
                <div class="card">
                    <div class="card-header">
                        <span>我的bot</span>

                        <!-- Button trigger modal -->
                        <button type="button" class="btn btn-primary float-end" data-bs-toggle="modal"
                            data-bs-target="#add-bot-btn">
                            创建Bot
                        </button>

                        <!-- Modal -->
                        <div class="modal fade" id="add-bot-btn" tabindex="-1" aria-hidden="true">
                            <div class="modal-dialog modal-xl">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title">创建Bot</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="mb-3">
                                            <label for="add-bot-title" class="form-label">名称</label>
                                            <input v-model="addbot.title" type="text" class="form-control"
                                                id="add-bot-title" placeholder="请输入Bot名称">
                                        </div>
                                        <div class="mb-3">
                                            <label for="add-bot-description" class="form-label">简介</label>
                                            <textarea v-model="addbot.description" class="form-control"
                                                id="add-bot-description" rows="3" placeholder="请输入Bot简介"></textarea>
                                        </div>
                                        <div class="mb-3">
                                            <label for="add-bot-code" class="form-label">代码</label>
                                            <VAceEditor v-model:value="addbot.content" lang="markdown" theme="textmate"
                                                style="height: 300px" />
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <div class="error-message">{{ addbot.error_message }}</div>
                                        <button @click="add_bot" type="button" class="btn btn-primary">创建</button>
                                        <button @click="refresh_bots" type="button" class="btn btn-secondary"
                                            data-bs-dismiss="modal">取消</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="card-body">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>名称</th>
                                    <th>创建时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="bot in bots" :key="bot.id">
                                    <td>{{ bot.title }}</td>
                                    <td>{{ bot.createtime }}</td>
                                    <td>
                                        <button type="button" class="btn btn-secondary" data-bs-toggle="modal"
                                            :data-bs-target="'#update-bot-modal-' + bot.id">修改</button>

                                        <!-- Modal -->
                                        <div class="modal fade" :id="'update-bot-modal-' + bot.id" tabindex="-1"
                                            aria-hidden="true">
                                            <div class="modal-dialog modal-xl">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h1 class="modal-title">创建Bot</h1>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                            aria-label="Close"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <div class="mb-3">
                                                            <label for="add-bot-title" class="form-label">名称</label>
                                                            <input v-model="bot.title" type="text" class="form-control"
                                                                id="add-bot-title" placeholder="请输入Bot名称">
                                                        </div>
                                                        <div class="mb-3">
                                                            <label for="add-bot-description" class="form-label">简介</label>
                                                            <textarea v-model="bot.description" class="form-control"
                                                                id="add-bot-description" rows="3"
                                                                placeholder="请输入Bot简介"></textarea>
                                                        </div>
                                                        <div class="mb-3">
                                                            <label for="add-bot-code" class="form-label">代码</label>
                                                            <VAceEditor v-model:value="bot.content" lang="java"
                                                                theme="textmate" style="height: 500px" />
                                                        </div>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <div class="error-message">{{ addbot.error_message }}</div>
                                                        <button @click="update_bot(bot)" type="button"
                                                            class="btn btn-primary">保存修改</button>
                                                        <button @click="refresh_bots" type="button"
                                                            class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button @click="remove_bot(bot)" type="button" class="btn btn-danger">删除</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//import ContentField from '@/components/ContentField'
import $ from 'jquery'
import { ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { Modal } from 'bootstrap/dist/js/bootstrap';

import { VAceEditor } from 'vue3-ace-editor';
// import ace from "ace-builds";
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-markdown';


export default {
    components: {
        VAceEditor,
    },
    setup() {
        // ace.config.set(
        //     "basePath",
        //     "https://cdn.jsdelivr.net/npm/ace-builds@" + require('ace-builds').version + "/src-noconflict/")


        const store = useStore();
        let bots = ref('');

        const addbot = reactive({
            title: "",
            description: "",
            content: "",
            error_message: "",
        });

        const refresh_bots = () => {
            $.ajax({
                url: "http://47.113.218.189:3000/api/user/bot/getlist/",
                type: "get",
                data: {

                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    bots.value = resp;
                },
                error(resp) {
                    console.log(resp);
                },
            });
        }
        refresh_bots();

        const add_bot = () => {
            addbot.error_message = "";
            $.ajax({
                url: "http://47.113.218.189:3000/api/user/bot/add/",
                type: "post",
                data: {
                    title: addbot.title,
                    description: addbot.description,
                    content: addbot.content,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    if (resp.message === "success") {
                        addbot.title = "";
                        addbot.description = "";
                        addbot.content = "";
                        Modal.getInstance("#add-bot-btn").hide();
                        refresh_bots();
                    } else {
                        addbot.error_message = resp.message;
                    }
                },
                error(resp) {
                    console.log(resp);
                },
            });
        }
        const remove_bot = (bot) => {
            $.ajax({
                url: "http://47.113.218.189:3000/api/user/bot/remove/",
                type: "post",
                data: {
                    bot_id: bot.id,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    if (resp.message === "success") {
                        refresh_bots();
                    } else {
                        addbot.error_message = resp.message;
                    }
                },
                error(resp) {
                    console.log(resp);
                },
            });
        }

        const update_bot = (bot) => {
            addbot.error_message = "",
                $.ajax({
                    url: "http://47.113.218.189:3000/api/user/bot/update/",
                    type: "post",
                    data: {
                        bot_id: bot.id,
                        title: bot.title,
                        description: bot.description,
                        content: bot.content,
                    },
                    headers: {
                        Authorization: "Bearer " + store.state.user.token,
                    },
                    success(resp) {
                        if (resp.message === "success") {
                            Modal.getInstance('#update-bot-modal-' + bot.id).hide();
                            refresh_bots();
                        } else {
                            addbot.error_message = resp.message;
                        }
                    },
                    error(resp) {
                        console.log(resp);
                    },
                });
        }



        return {
            bots,
            addbot,
            refresh_bots,
            add_bot,
            remove_bot,
            update_bot,
        }
    },

}

</script>

<style scoped>
.card {
    margin-top: 20px;
}

.error-message {
    color: red;
}

span {
    font-size: 130%;
}

button {
    margin-right: 10px;
}

VAceEditor {
    font-size: 200%;
}</style>