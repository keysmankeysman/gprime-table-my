<template>
    <div>
        <data-table
            :column="column"
            :items="items"
            :dataShort="results"
            :columns="columns"
            @upDescrInfo="onClickRow"
            @onCheckRow="onCheckRow"
        ></data-table>
    </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import dataShort from './data/dataShort.js'

export default {
    name: 'searchTableDialog',
    data() {
        return {
            column: [
                { id: 1, name: 'Наименование' },
                { id: 2, name: '№' },
                { id: 3, name: 'Дата' },
            ],
            items: [
                { name: 'Рубашка', number: '3455', date: '13.15.21' },
                { name: 'Штаны', number: '3224', date: '16.15.21' },
                { name: 'Галстук', number: '4348', date: '19.15.21' }
            ],
            selectedItems: [],
            results: []
        }
    },
    methods: {
        onClickRow() {
            console.log('выбрали одну строку')
        },
        onCheckRow (row) {
            let index = this.results.findIndex(el => el.objectIdValue === row.attributes[0].value)
            this.selectedItems.push(this.results[index])
        },
        getLayerSettings() {
            let allowColumns = ["document_type", "document_relevancy", "isogd_service", "territory"]
            if (!allowColumns.length) {
                this.noData = true
                return
            }
            let aliasesColumns = dataShort.aliases
            let keys = Object.keys(aliasesColumns)
            let arrColumns = []
            allowColumns.forEach(e => {
                for (let i = 0; i < keys.length; i++) {
                let obj = {}
                if (e === keys[i]) {
                    obj.title = aliasesColumns[keys[i]]
                    obj.field = keys[i]
                    arrColumns.push(obj)
                    obj = {}
                }
                }
            })
            this.columns = arrColumns
        }
    },
    components: {
        DataTable
    },
    created() {
        this.results = dataShort.items
        this.columns = dataShort.columns
        this.getLayerSettings()
    }
}
</script>