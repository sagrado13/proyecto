<template>
  <div>
    <!-- Declaramos vue-headful -->
    <vue-headful title="Resetear contraseña" />

    <!-- MODAL PARA RESETEAR LA CONTRASEÑA -->
    <div class="modal">
      <div class="modalBox">
        <h4>Recupera tu contraseña:</h4>
        <small class="errorMsg" v-if="showMsg"
          >*No coincide la contraseña*</small
        >
        <input
          :class="{ error: showMsg === true }"
          type="password"
          v-model="newPassword"
          placeholder="Contraseña nueva"
        />
        <small class="errorMsg" v-if="showMsg"
          >*No coincide la contraseña*</small
        >
        <input
          :class="{ error: showMsg === true }"
          type="password"
          v-model="newPassword1"
          placeholder="Repite la contraseña"
        />
        <div>
          <button @click="resetPasswordUser()">Resetear contraseña</button>
          <button>
            <router-link :to="{ name: 'Home' }">Cancelar</router-link>
          </button>
        </div>
      </div>
    </div>
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
      newPassword1: "",
      showMsg: false,
    };
  },
  methods: {
    // FUNCIÓN PARA RESETEAR CONTRASEÑA DE USUARIO
    async resetPasswordUser() {
      if (this.newPassword !== this.newPassword1) {
        return (this.showMsg = true);
      }
      try {
        const response = await axios.post(
          process.env.VUE_APP_BACK_URL +
            "users/reset-password/" +
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

<style scoped>
.error {
  background-color: rgba(255, 0, 0, 0.336);
}
.error:hover {
  background-color: white;
}
.modal {
  position: fixed;
  display: flex;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background: rgba(252, 249, 249, 0.8);
}
.modalBox {
  margin: 2% auto;
  padding: 1rem;
  width: 80%;
  border: 1px solid #888;
  background: rgb(0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
}
button {
  outline: none;
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
  padding-left: 0.2rem;
  padding-right: 0.2rem;
  font-size: 0.7rem;
  box-shadow: 5px 5px 30px white inset;
  border-radius: 20px;
  margin: 0.5rem;
}
input {
  outline: 0;
  border-width: 0 0 1px;
  border-color: yellowgreen;
  padding: 0.2rem;
  font-size: 0.7rem;
  text-align: center;
  background: rgb(22, 22, 22);
  color: white;
  margin: 1rem;
}

@media (min-width: 700px) {
  input {
    font-size: 0.9rem;
  }
  button {
    padding: 0.2rem;
    font-size: 0.8rem;
  }
}

@media (min-width: 1000px) {
  .modalBox {
    width: 30%;
  }
  button {
    font-size: 1rem;
  }
}
</style>
