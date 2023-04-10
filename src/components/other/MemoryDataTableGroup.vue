<template>
  <data-table
    ref="dataTable"
    v-bind="$attrs"
    v-on="$listeners"
    groupable
    :count="filteredItems.length"
    :items="visibleItems"
    :columns="columns"
    :value="selectedValue"
    :pagable="pagable"
    @input="onSelectChanged"
    @change="onFiltersChanged"
    @changingValue="$emit('changingValue', $event)"
  />
</template>

<script>
import { filter, sort, offset } from '^/components/DataTable/helpers'

/**
 * Компонент "Грид с разбиением элементов по группам"
 *
 * @vue-prop {array<object>} items - Элементы грида
 * @vue-prop {string} items[].title - Заголовок группы
 * @vue-prop {array} items[].children - Элементы группы
 * @vue-prop {array} columns - Настройки колонок грида
 * @vue-prop {object} value - Активная запись
 * @vue-prop {object} value.group - Выбранный блок
 * @vue-prop {object} value.item - Выбранный элемент
 * @vue-prop {boolean} pagable - Флаг необходимости разбить грид на страницы
 *
 * @vue-data {object} params - Настройки грида (фильтры, сортировки, пагинация)
 *
 * @vue-computed {object} selectedValue - Активная запись.
 * Происходит замена ссылкы с items на filterdItems, для удобства работы с данным компонентом
 * @vue-computed {array} filteredItems - Элементы грида с применением фильтрации и сортировки
 * @vue-computed {array} visibleItems - Элементы грида с применением пагинации (или все, если паганация выключена)
 *
 * @vue-event onFiltersChanged - Обработчик события изменения параметров грида (фильтры, сортипровка, пагинация)
 * @vue-event onSelectChanged - Обработчик события изменения активной записи грида, с подменной ссыки с filteredItems на items
 */
export default {
  inheritAttrs: false,
  props: {
    items: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    value: {
      type: Object,
      default: null
    },
    pagable: {
      type: Boolean,
      default: null
    }
  },
  data () {
    return {
      params: {
        page: 1,
        size: 10,
        filters: [],
        sorting: []
      }
    }
  },
  watch: {
    visibleItems (value) {
      // Если на текущей странице не осталось элементов
      // то переключаемся на 1 страницу
      if (!value.length && this.params.page !== 1) {
        this.params.page = 1
        this.$refs.dataTable.resetPage()
      }
      // Если активный элемент оказался на другой странице
      // то снимаем выделение
      if (this.selectedValue && this.selectedValue.group && !this.visibleItems.includes(this.selectedValue.group)) {
        this.$emit('input', null)
      }
    }
  },
  computed: {
    selectedValue () {
      return this.value
        ? {
          group: this.filteredItems.find(x => x.original === this.value.group),
          item: this.value.item
        }
        : null
    },
    filteredItems () {
      return this.items
        .map(x => ({
          ...x,
          original: x,
          children: sort(
            filter(x.children, this.params.filters),
            this.params.sorting, this.columns
          )
        }))
        .filter(x => x.children.length || !this.params.filters.length)
    },
    visibleItems () {
      return this.pagable
        ? offset(this.filteredItems, this.params)
        : this.filteredItems
    }
  },
  methods: {
    onFiltersChanged (filters) {
      if (filters.page !== this.params.page) {
        this.$emit('input', null)
      }
      this.params = Object.assign({}, this.params, filters)
    },
    onSelectChanged (payload) {
      if (payload && payload.group) {
        payload.group = payload.group.original
      }
      this.$emit('input', payload)
    }
  }
}
</script>
