<template>
  <div></div>
</template>

<script>
// Importamos axios
import axios from "axios";
// Importamos sweetalert2
import Swal from "sweetalert2";
export default {
  name: "ValidationUser",
  methods: {
    // FUNCIÓN PARA VALIDAR CUENTA DE USUARIO
    async validationUser() {
      try {
        console.log(this.$route.params.registrationCode);
        const response = await axios.get(
          "http://localhost:3000/users/validation/" +
            this.$route.params.registrationCode
        );
        Swal.fire({
          title: `${response.data.message}`,
          icon: "success",
          confirmButtonText: "OK",
        });
        this.$router.push("/");
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },
  },
  created() {
    this.validationUser();
  },
};
</script>

<style>
</style>