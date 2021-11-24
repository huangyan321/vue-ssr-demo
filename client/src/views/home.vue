<template>
  <div>
    <h1>home页</h1>
    <button @click="ADD">加一</button>
    <div>{{ num }}</div>
  </div>
</template>
<script>
import { mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  mounted() {},
  computed: {
    ...mapGetters({
      num: 'num'
    })
  },
  methods: {
    ...mapMutations("list", {
      ADD: "ADD"
    })
  }
};
</script>
<style scoped></style>
