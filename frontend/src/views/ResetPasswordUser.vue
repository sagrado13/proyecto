<template>
  <div>
    <h2>Recupera tu contraseña:</h2>
    <input type="password" v-model="newPassword" placeholder="Contraseña nueva" />
    <br />
    <button @click="resetPasswordUser()">Resetear contraseña</button>
  </div>
</template>

<script>
// Importamos axios
import axios from "axios";
// Importamos sweetalert2
import Swal from "sweetalert2";
export default {
  name: "ResetPasswordUser",
  data() {
    return {
      newPassword: "",
    };
  },
  methods: {
    // FUNCIÓN PARA RESETEAR CONTRASEÑA DE USUARIO
    async resetPasswordUser() {
      try {
        const response = await axios.post(
          "http://localhost:3000/users/reset-password/" +
            this.$route.params.recoverCode,
          {
            newPassword: this.newPassword,
          }
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
};
</script>

<style>
</style>