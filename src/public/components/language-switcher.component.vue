<template>
  <div class="relative">
    <button @click="toggle" class="flex items-center px-2 py-1 border rounded bg-white text-sm">
      <span :class="flagClass[$i18n.locale]" class="fi mr-1"></span>
      {{ label[$i18n.locale] }}
    </button>
    <div v-if="open" class="absolute mt-1 bg-white border rounded shadow z-10 w-24">
      <button
          v-for="lang in languages"
          :key="lang"
          @click="setLanguage(lang)"
          class="flex items-center w-full px-2 py-1 text-sm hover:bg-gray-100"
      >
        <span :class="flagClass[lang]" class="fi mr-2"></span>
        {{ label[lang] }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false,
      languages: ['en', 'es'],
      label: {
        en: 'English',
        es: 'Español'
      },
      flagClass: {
        en: 'fi fi-us',
        es: 'fi fi-es'
      }
    }
  },
  methods: {
    toggle() {
      this.open = !this.open;
    },
    setLanguage(lang) {
      this.$i18n.locale = lang;
      this.open = false;
    }
  }
}
</script>

<style>
@import 'https://cdn.jsdelivr.net/npm/flag-icons/css/flag-icons.min.css';
</style>
