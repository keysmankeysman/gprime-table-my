<template>
  <div class="dt-body" :class="tableClass">
    <table class="table dataTable">
      <colgroup>
        <col
          v-for="(column, index) of columns"
          :key="index"
          :style="{ width: column.calculatedWidth }">
      </colgroup>
      <tbody>
        <template v-for="(group, groupIndex) of items">
          <tr :key="groupIndex" @click="onSelectGroup(group)">
            <td 
              :colspan="columns.length"
              class="group-title-row"
              :class="{selected: selectedGroup === group}"
            >
              {{ group.title }}
            </td>
          </tr>
          <template v-for="(item, itemIndex) of group.children">
            <tr
              :key="`${groupIndex}_${itemIndex}`"
              v-on="selectable ? { click: () => onSelect(group, item) } : null"
              class="red"
              :class="rowClass"
            >
              <data-table-cell
                v-for="(column, columnIndex) of columns"
                :key="columnIndex"
                :column="column"
                :item="item"
                :selected="selected"
                :selectable="selectable"
                :align="column.textAlign"
                :class="getCellClass(item, column)"
                @changingValue="$emit('changingValue', $event)"
              />
            </tr>
          </template>
        </template>
      </tbody>
    </table>
    <div class="no-data-tooltip-container" v-if="items.length === 0">
      <div class="no-data-tooltip">
      {{ noDataTooltip }}
      </div>
    </div>
  </div>
</template>

<script>
import DataTableCell from './DataTableCell'

/**
 * Компонент "Содержимое грида с разбиением элементов по группам"
 * TODO Создается на базе компонента DataTableBody
 */
export default {
  components: {
    DataTableCell
  },
  props: {
    borderClass: Boolean,
    canSelectCallback: {
      type: Function
    },
    selectable: Boolean,
    value: Object,
    columns: Array,
    items: Array,
    readonly: {
      type: Boolean,
      default: false
    },
    noDataTooltip: {
      type: String,
      default: 'Нет данных'
    }
  },
  data () {
    return {
      selected: null,
      selectedGroup: null
    }
  },
  computed: {
    rowClass () {
      if (!this.selectable) {
        return null
      }

      return {
        'row-hoverable': true
      }
    },
    tableClass () {
      if (!this.items) {
        return null
      }

      return {
        'no-rows-table': !this.items.length
      }
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) {
        this.selected = null
        this.selectedGroup = null
        return
      }
      if (newValue.item) {
        this.selected = newValue.item
        this.selectedGroup = null
      } else {
        this.selected = null
        this.selectedGroup = newValue.group
      }
    }
  },
  mounted () {
    this.$el.addEventListener('scroll', this.onScroll)
  },
  destroyed () {
    this.$el.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    setBusy (isBusy) {
      this.blockUI(this.$el, isBusy)
    },
    onScroll (event) {
      this.$emit('scrollLeft', event.target.scrollLeft)
    },
    async onSelect (group, item) {
      if (this.selected === item) {
        return
      }

      if (await this.canSelectCallback()) {
        this.selected = item
        this.selectedGroup = null
        this.$emit('select', { group, item })
      }
    },
    async onSelectGroup (group) {
      if (this.selectedGroup === group) {
        return
      }

      if (await this.canSelectCallback()) {
        this.selected = null
        this.selectedGroup = group
        this.$emit('select', { group, item: null })
      }
    },
    getCellClass (item, column) {
      const cellClass = column.cellClass
      if (!cellClass) {
        if (column.class) {
          return {
            [column.class]: true,
            selected: this.selected === item && this.selectable,
            borders: !!this.borderClass
          }
        }
        return {
          selected: this.selected === item && this.selectable,
          borders: !!this.borderClass
        }
      }
      if (typeof cellClass === 'string') {
        return cellClass
      }
      const classes = {
        ...cellClass(item, column),
        selected: this.selected === item && this.selectable,
        borders: !!this.borderClass
      }
      return classes
    }
  }
}
</script>

<style scoped>
.borders {
  border: 0.5px solid #bbb;
  border-collapse: collapse;
}
.dt-body {
  flex: 1 1 0;
  /* В IE не оторажаются элементы без этих свойств */
  /* https://github.com/philipwalton/flexbugs#flexbug-1 */
  -ms-flex-preferred-size: 0px;
  -ms-flex-negative: 0;
  /* !!! Закоментировано, так как overflow поменян на auto  */
  /* Для предотвращения смещения заголовков */
  /* overflow-y: scroll; */
  overflow: auto;
  /* WORKAROUND в IE11 без указания высоты flex элемент не сжимается по высоте */
  height: 650px;
  border-bottom: 1px solid #bbb;
  flex-basis: 650px;
}
.dt-body table {
  table-layout: fixed;
  border-top: none;
  border-collapse: collapse;
}
.dt-body table.no-rows-table {
  height: 100%;
}
.dt-body.no-rows-table {
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}
.dt-body div.no-data-tooltip-container {
  flex: 1;
  width: 100%;
  display: flex;
  justify-content:center;
  align-content:center;
  flex-direction:column;
}
.dt-body div.no-data-tooltip {
  text-align: center;
  margin: 10px;
  font-size: 15px;
  font-weight: bold;
}
.dt-header + .dt-body table {
  border-top: 1px solid #ddd;
}
.dt-body tbody > tr.selected {
  background-color: #e3f2fd;
  color: #104d92;
}
.dt-body tr span {
  max-height: 4.8em;
  overflow: hidden;
  display: block;
}

.dt-body tr a {
  max-height: 4.8em;
  overflow: hidden;
  display: block;
}

td {
  word-break: break-word;
  text-align: left
}
@media (max-width: 425px) {
  .dt-body {
    min-height: 300px;
    flex-basis: 300px;
  }
}
</style>
