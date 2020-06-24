import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

// Your own translation file
import vi from '../translation/vi.ts'

Vue.component('my-component', {
  methods: {
    changeLocale () {
      this.$vuetify.lang.current = 'vi'
    },
  },
})

export default new Vuetify({
  lang: {
    locales: { vi },
    current: 'vi',
  },
})
