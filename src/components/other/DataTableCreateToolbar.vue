<template>
  <div class="data-table-toolbar-icon-block">
    <button class="btn btn-default btn-icon" :disabled="!isSaveCreateBtnActive" @click="saveCreate" :title="saveBtnTooltip">
      <i :class="saveBtnIcon"></i>
    </button>
    <button class="btn btn-default btn-icon" @click="cancelCreate" title="Отмена">
      <i class="icon_cross"></i>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    itemForCreate: Object,
    isSaveCreateBtnActive: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      //
    }
  },
  computed: {
    saveBtnIcon () {
      return this.itemForCreate.saveBtnIcon || 'icon_floppy_disk'
    },
    saveBtnTooltip () {
      return this.itemForCreate.saveBtnTooltip || 'Сохранить'
    }
  },
  methods: {
    saveCreate () {
      this.$emit('saveCreateGo')
    },
    cancelCreate () {
      this.$emit('cancelCreateGo', this.itemForCreate)
    }
  }
}
</script>

<style scoped>
.data-table-toolbar-icon-block .btn-icon {
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 4px;
  padding-bottom: 4px;
}

</style>