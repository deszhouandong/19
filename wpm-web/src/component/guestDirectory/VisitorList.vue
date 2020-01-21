<template>
  <div class="list-con">
    <VisitorListItem v-for="(item,index) in guestList" :key="index" :item="item" :index="index" @deleteRecordHanlder="deleteRecordHanlder"/>
  </div>
</template>

<script>
import { List } from "vant";
import VisitorListItem from "./VisitorListItem";

export default {
  components: {
    VisitorListItem
  },
  props: {
    guestList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {

    };
  },

  methods: {
     //删除记录
      deleteRecordHanlder(index) {
        this.guestList.splice(index, 1);
      }
  }
};
</script>

<style lang="scss" scoped>
.list-con {
  margin-bottom: 90px;
}
</style>
