<template>
  <td>
    <span
      v-if="!column.type"
      class="simple-text-cell"
      :title="getTooltip(item, column)"
    >
      {{ getValue(item, column) }}
    </span>
    <data-table-input
      v-else-if="column.type === 'inputText'"
      :readonly="readonly"
      :value="rawValue"
      :required="column.required"
      :maxlength="column.maxlength"
      @setNewValue="setNewValue"
    />
    <data-table-number-input
      v-else-if="column.type === 'inputNumber'"
      :readonly="readonly"
      :value="item[column.field]"
      :required="column.required"
      :isInteger="column.isInteger"
      :isNotNegative="column.isNotNegative"
      :decimalPlaces="column.decimalPlaces"
      @setNewValue="setNewValue"
    />
    <data-table-checkbox
      v-else-if="column.type === 'checkbox'"
      :value="item[column.field]"
      @setNewValue="setNewValue"
      :disabled="isDisabled(item, column) || readonly"
    />
    <degree-coordinate-input
      v-else-if="column.type === 'inputDegreeCoordinate'"
      :value="item[column.field]"
      :type="column.degreeType"
      :readonly="readonly"
      :required="column.required"
      @input="setNewValue"
    />
  </td>
</template>

<script>
import moment from 'moment'
import _get from 'lodash/get'
import _set from 'lodash/set'
import DataTableInput from './DataTableInput'
import DataTableNumberInput from './DataTableNumberInput'
import DataTableCheckbox from './DataTableCheckbox'
import DegreeCoordinateInput from '^/components/form/DegreeCoordinateInput'

/**
 * Компонент "Ячейка таблицы"
 * TODO. Рефакторинг компонента DataTableBody
 *
 * @vue-prop {object} colum - Настройки колонки
 * @vue-prop {object} item - Элемент строки
 * @vue-prop {boolean} readonly - Флаг установки элемента грида в режим "Только чтение"
 *
 * @vue-computed {any} rawValue - Значение элементы для данной ячейки (без форматирования)
 */
export default {
  components: {
    DataTableInput,
    DataTableNumberInput,
    DataTableCheckbox,
    DegreeCoordinateInput
  },
  props: {
    column: {
      type: Object,
      required: true
    },
    item: {
      type: Object,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    rawValue () {
      return _get(this.item, this.column.field, '')
    }
  },

  methods: {
    getTooltip (item, column) {
      if (!column.tooltipFunc) {
        return this.getValue(item, column)
      }

      return column.tooltipFunc(item, column)
    },

    getValue (item, column) {
      // Формат передачи значений справочников:
      // column.displayField = "611e62c9-7f3c-4990-a95a-79840f2508e0"
      // column.displayValue = "name"
      //
      // Описание колонки:
      // {
      //   "title": "Тип территориальной единицы",
      //   "id": "611e62c9-7f3c-4990-a95a-79840f2508e0",
      // }
      //
      // Значение:
      // {
      //   "type_territorial_unit_id": "d0e77ba9-203b-4924-92ec-0f4d5018fe32",
      //   "611e62c9-7f3c-4990-a95a-79840f2508e0": {
      //     "name": "Муниципальный район"
      //   }
      // }
      if (column.displayField && column.displayValue && item[column.displayField]) {
        return item[column.displayField][column.displayValue]
      }
      const columnValue = _get(item, column.field, '')
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

    setNewValue (newValue) {
      _set(this.item, this.column.field, newValue)
      // TODO передать колбэк в объект колонки, аттрибут type(onClick)
      this.$emit('changingValue', newValue)
    },

    isDisabled (item, column) {
      if (!column.isDisabled) {
        return false
      }
      return column.isDisabled(item, column)
    }
  }
}

</script>
