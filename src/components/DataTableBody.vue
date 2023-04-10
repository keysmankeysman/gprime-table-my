<template>
  <div class="dt-body">
    <table class="table dataTable">
      <tbody>
        <template v-for="(item, itemIndex) of items">
          <tr
            :key="itemIndex"
            class="red"
          >
            <td
              v-for="(column, columnIndex) of columns"
              :key="columnIndex"
              :align="column.textAlign"
            >
              <!-- <input @click.stop="onCheckRow(item, $event)" type="checkbox" class="custom-checkbox" :id="item.attributes[0].value" :value="item" v-model="selectedItems"> -->
              <span class="simple-text-cell" v-if="!column.type">{{ getValue(item, column) }}</span>
            </td>
          </tr>
        </template>
        </tbody>
    </table>
  </div>
</template>

<script>
import moment from 'moment'
import _get from 'lodash/get'


export default {
  components: {

  },
  props: {
    value: Object,
    columns: Array,
    items: Array,
  },
  data () {
    return {
      selectedItems: []
    }
  },
  methods: {
    getValue (item, column) {
      // console.log(item)
      // console.log(column)

      if (column.displayField && column.displayValue && item[column.displayField]) {
        return item[column.displayField][column.displayValue]
      }
      console.log(item)
      console.log(column)
      const columnValue = _get(item, column.field, '')
      console.log('columnValue:')
      console.log(columnValue)
      if (column.dateFormat) {
        if (!column.field) {
          return ''
        }
        const parsedDate = column.dateFormat === 'date' ? moment(columnValue, ['YYYY-MM-DD', moment.ISO_8601]) : moment(columnValue)
        if (parsedDate.isValid()) {
          if (column.dateFormat === 'date') {
            return column.displayFormat ? parsedDate.format(column.displayFormat) : parsedDate.format('DD.MM.YYYY')
          }
          if (column.dateFormat === 'datetime') {
            return column.displayFormat ? parsedDate.format(column.displayFormat) : parsedDate.format('DD.MM.YYYY HH:mm:SS')
          }
          return parsedDate.format(column.dateFormat)
        }
      }
      if (column.render) {
        return column.render(columnValue, item)
      }
      return columnValue
    },
    onCheckRow (row, event) {
      if (event.target.type === 'checkbox') {
        this.$emit('onCheckRow', row)
      }
    }
  }
}
</script>

<style scoped>
.has-warning {
  border: 1px solid red;
}
.borders {
  border: 0.5px solid #bbb;
  border-collapse: collapse;
}
.dt-body {
  flex: 1 1 0;
  -ms-flex-preferred-size: 0px;
  -ms-flex-negative: 0;
  overflow: auto;
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
.dt-body .no-data-cell-placeholder {
  padding-bottom: 0px;
  padding-top: 1px;
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

.data-table-lookup-input .form-control {
  padding: 3px 10px !important;
  height: 30px !important
}
.data-table-lookup-input .select2-selection.select2-selection--single {
  height: 30px;
  padding-top: 4px
}
td {
  word-break: break-word;
  text-align: center;
}
.aggregation-row-column {
  border-top: 1.4px solid #000000;
  vertical-align: bottom;
}
.aggregation {
  border: 2.4px solid #000000;
  vertical-align: bottom;
}
.data-table-links-cell > a {
  display: block
}
</style>
