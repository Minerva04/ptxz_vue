<template>
    <div>
        <h1 style="margin-left: 530px;font-size: 50px;margin-top: -20px;">welcom</h1>
        <el-carousel :interval="4000" type="card" height="500px">
            <el-carousel-item v-for="(item, index) in imgpath" :key="index">
                <router-link :to=path[index]>
                    <img :src=getPath(item) alt="welcome">
                </router-link>
            </el-carousel-item>
        </el-carousel>
        <div style="text-align: center;">
            <a href="https://beian.miit.gov.cn/" target="_blank">
                赣ICP备2023003235号-1</a>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            path: ['/runner', '/twohand', '/change'],
            imgpath: ['runner.jpg', 'twohand.jpg', 'change.jpg']
        }
    },
    methods: {
        getPath(path) {
            return `http://localhost:7070/api/file/download?name=${path}`;
        }
    }
}
</script>
<style></style>