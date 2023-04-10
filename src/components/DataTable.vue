<template>
  <div class="dt-table">
    <data-table-body 
      :items='items'
      :columns="columns"
      :borderClass='false'
      :createItem='{}'
      @onCheckRow="onCheckRow"
    />
    <!-- <search-entity-description
      :selectedRow="selectedRow"
      ref="searchDescription"
    /> -->
  </div>
</template>

<script>
// import DataTableHeader from './DataTableHeader'
import DataTableBody from './DataTableBody'
// import data from './data/data.js'
// import SearchEntityDescription from './Modals/SearchEntityDescription'

export default {
  data () {
    return {
      sorting: [], 
      items: [], 
      tooltipShow: false,
      isDisabled: true
    }
  },
  props: {
    selectedRow: Object,
    columns: Array,
    dataShort: Array
  },
  components: {
    // DataTableHeader,
    DataTableBody,
    // SearchEntityDescription
  },
  created() {
    this.sorting = this.dataShort.sorting
    this.items = this.dataShort
  },

  methods: {
    showMore () {
      // this.$emit('upDescrInfo')
      this.$refs.searchDescription.openModal()
    },
    onCheckRow (val) {
      this.selectedResult = val
      this.$emit('onCheckRow', val)
    }
  }
}
</script>

<style scoped>
.dt-table {
  display: flex;
  flex-direction: column;
}

</style>
