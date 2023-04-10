<template>
  <div class="data-table-input-container" :class="{'has-warning has-feedback': value == null && required}">
    <input
      type="text"
      :value="value"
      :readonly="readonly"
      class="form-control"
      @input="onInput"
      :placeholder="required ? 'Заполните поле' : ''"
      :title="value"
      :maxlength="maxlength"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default () {
        return false
      }
    },
    maxlength: {
      type: Number,
      default: null
    }
  },
  methods: {
    onInput (input) {
      this.$emit('setNewValue', input.target.value)
    }
  }
}
</script>

<style scoped>
.data-table-input-container .form-control {
  padding: 3px 10px;
  height: 30px;
}

</style>
