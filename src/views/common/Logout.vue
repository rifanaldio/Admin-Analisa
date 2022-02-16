<template>
  <div>{{ message }}</div>
</template>

<script>
import Login from "@/views/Login";

export default {
  name: "Logout",
  data() {
    return {
      message: "Processing your request..",
    };
  },
  mounted() {
    setTimeout(async () => {
      const booleanPromise = await this.$auth.logout();
      const $router = this.$router;

      if (!booleanPromise.ok) {
        this.message = booleanPromise.statusText;
        return void setTimeout(() => $router.back(), 600);
      }

      this.message = "Finish.";
      return void setTimeout(async () => {
        return void (await $router
          .replace({
            name: Login.name,
          })
          .then(() => {
            // sukses dan hapus semua header authorisasi
            this.removeHeaderAuthorization();
          }));
      }, 450);
    }, 500);
  },
};
</script>

<style scoped></style>
