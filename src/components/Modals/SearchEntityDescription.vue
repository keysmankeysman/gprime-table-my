<template>
  <div>
    <modal-dialog
      class="description"
      title="Подробнее"
      v-if="isShown"
      v-model="isShown"
      size="lg"
      appendToBody
    >
      <table class="table table-striped">
        <tbody>
          <tr v-for="(attribute, index) of selectedRow.attributes" :key="index">
            <td>{{ attribute.name }}</td>
            <td>{{ attribute.value }}</td>
          </tr>
        </tbody>
      </table>
      <div slot="footer">
        <button
          class="btn btn-primary"
          type="button"
          @click="closeModal"
        >
          Закрыть
        </button>
      </div>
    </modal-dialog>
  </div>
</template>

<script>

export default {
  components: {

  },
  props: {
    selectedRow: Object
  },
  data () {
    return {
      isShown: false,
      entityProperties: null,
      currentComponent: null
    }
  },
  methods: {
    closeModal () {
      this.isShown = false
    },
    openModal () {
      this.isShown = true
    },
    setComponent (component) {
      const { component: componentName, ...params } = component
      switch (componentName) {
        case 'IsogdDocumentCard' :
          this.currentComponent = componentName
          this.entityProperties = params.viewParams
          break
        case 'UrbanPlanningCard' :
          this.currentComponent = componentName
          this.entityProperties = params
          break
        case 'RegistriesRecord' :
          this.currentComponent = componentName
          this.entityProperties = {
            id: {
              id: 1,
              item: params.record,
              mode: params.registry.claims.update ? 'edit' : 'view',
              registry: params.registry
            },
            isModalView: true
          }
          break
        default: break
      }
    }
  }
}
</script>

<style>

.description .modal-dialog .modal-content .modal-body {
  display: flex !important;
}
.modal {
  overflow: hidden !important;
}




</style>