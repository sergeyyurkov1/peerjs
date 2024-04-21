<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

const appHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--app-height", `${window.innerHeight}px`);
};

export default {
  name: 'App',

  created() {
    window.addEventListener("resize", appHeight);
    appHeight();
  },

  data: () => ({
    //
  }),
}
</script>