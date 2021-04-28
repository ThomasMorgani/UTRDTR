<template>
  <div
    id="modal-sections"
    class="uk-modal uk-flex uk-content-center uk-open"
    @click="$emit('closeModal')"
  >
    <div class="uk-modal-dialog   uk-margin-auto-vertical">
      <img :src="src" alt="" width="150px" />
    </div>
  </div>
</template>
<script>
export default {
  props: ['src'],
  created() {
    console.log(this.src)
  }
}
</script>
<style scoped>
.uk-modal-dialog {
  background: none;
  width: 150px;
}
</style>
