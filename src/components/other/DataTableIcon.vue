<template>
  <div class="data-table-icon-container">
    <span v-if="!isLinkIcon && icon" :class="icon" class="data-table-icon"></span>
    <icon-button
      v-if="isLinkIcon && icon"
      default
      :title="linkIconTitle"
      :icon="icon"
      @click="linkIconHandler"
    />
  </div>
</template>

<script>
export default {
  props: {
    isLinkIcon: {
      type: Boolean,
      default: false
    },
    linkIcon: {
      type: String,
      default: null
    },
    linkIconTitle: {
      type: String,
      default: ''
    },
    icon: {
      type: String
    },
    height: {
      type: Number,
      default: 16
    },
    width: {
      type: Number,
      default: 16
    }
  },
  methods: {
    linkIconHandler () {
      this.$emit('onClickLinkIcon')
    }
  }
}
</script>

<style scoped>
.data-table-icon-container {
  padding: 3px 10px;
  text-align: center;
}

.data-table-icon {
  height: 16px;
  width: 16px;
}

</style>
