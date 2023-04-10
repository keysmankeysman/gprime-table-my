<template>
  <basic-input-filter
    :filter="filter"
    :hideEmpty="hideEmpty"
    @filter="$emit('filter')"
    :isLastIndex="isLastIndex"
    :isCorrectValidation="isCorrectValidation"
    :class="{ 'border-primary': filter.value }"
    :operators="operators"
  >
    <mask-input
      mask="99.99.9999"
      class="form-control"
      v-model="value"
      @keyup.enter="onFilter"
      :title="title"
      :disabled="isFiltersDisabled"
    />
    <div slot="dropdown-items" class="date-picker-container">
      <span class="date-picker-container-label">Выбор даты</span>
      <date-time-picker :enableTime="false" :value="dateValue" displayFormat="d.m.Y" @input="onDateInput($event)" noInput/>
    </div>
  </basic-input-filter>
</template>

<script>
import moment from 'moment'
import BasicInputFilter from './DataTableBasicInputFilter'

export default {
  props: {
    isFiltersDisabled: Boolean,
    filter: Object,
    operators: Array,
    isLastIndex: Boolean,
    isCorrectValidation: Boolean,
    title: String
  },
  components: {
    BasicInputFilter
  },
  data () {
    return {
      value: this.filter.value || null,
      dateValue: this.filter.value || null,
      operator: this.filter.operator || '=',
      hideEmpty: false
    }
  },
  watch: {
    filter: {
      deep: true,
      handler: function (newFilter) {
        this.value = this.fillDate(newFilter.value)// newFilter.value
        this.dateValue = this.convertDate(newFilter.value)
        this.operator = newFilter.operator
        this.hideEmpty = newFilter.hideEmpty || false
      }
    }
  },
  methods: {
    convertDate (inValue) {
      return (!inValue || inValue === '') ? null : moment(inValue, ['DD.MM.YYYY', 'DD.MM.YY', 'DD.MM', 'DD-MM-YY']).format('YYYY-MM-DD')
    },
    fillDate (value) {
      if (!value) {
        return
      }
      let splittedValue = value.split('.')

      if (splittedValue.every(el => !parseInt(el, 10))) {
        return value
      }

      const currentDate = {
        0: moment().format('DD'),
        1: moment().format('MM'),
        2: moment().format('YYYY')
      }
      return splittedValue.map((el, index) => {
        return parseInt(el, 10) ? el : currentDate[index]
      }).join('.')
    },
    onFilter () {
      this.filter.operator = this.operator
      this.filter.value = this.fillDate(this.value) // this.value
      this.dateValue = this.convertDate(this.value)
      this.$emit('filter')
    },
    onDateInput (input) {
      if (!input || input === '') {
        this.filter.value = moment().format('DD.MM.YYYY')
        this.filter.dateValue = null
        this.$emit('filter')
        return
      }
      const correctedDate = moment(input).format('DD.MM.YYYY')
      if (this.dateValue === correctedDate) {
        return
      }
      this.dateValue = moment(input).format('DD.MM.YYYY')
      this.filter.value = correctedDate
      this.$emit('filter')
    }
  }
}
</script>

<style scoped>
.date-picker-container {
  display: flex;
  align-items: center;
  margin: 5px;
  justify-content: space-between;
}

.date-picker-container-label {
  margin-left: 3px;
  margin-right: 3px;
}


</style>
