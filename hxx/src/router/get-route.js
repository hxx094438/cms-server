import ItemList from './ItemList.vue'

export function createListView (type) {
  return {
    name: `${type}-stories-view`,
    asyncData ({ store }) {
      return store.dispatch('GET_ITEM_DATA', { type })
    },
    render (h) {
      return h(ItemList, { props: { type } })
    }
  }
}