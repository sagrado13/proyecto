<template>
  <div>
    <!-- Declaramos vue-headful -->
    <vue-headful title="Abrir proceso" />

    <!-- BOTÓN DE VOLVER ATRÁS -->
    <button id="back" @click="goBack()">
      <img src="../assets/deshacer.svg" />
    </button>

    <!-- FORMULARIO PARA ABRIR PROCESO CON EL ABOGADO SELECCIONADO -->
    <div id="addProcess">
      <h1>Nuevo proceso con {{ this.$route.params.lawFirm }}</h1>
      <textarea
        v-model="message"
        name="message"
        placeholder="Descripción detallada del caso"
        required
      ></textarea>
      <button id="send" @click="addNewProcess()">📨 Enviar</button>
    </div>
  </div>
</template>

<script>
// Importamos axios
import axios from "axios";
// Importamos sweetalert2
import Swal from "sweetalert2";
// IMPORTAMOS FUNCIONES
import { isLoggedInUser } from "../api/utils";
import { getIdToken } from "../api/utils";
export default {
  name: "NewProcess",
  data() {
    return {
      message: "",
    };
  },
  methods: {
    async addNewProcess() {
      const result = await Swal.fire({
        title: "Estas seguro de que quieres iniciar el proceso",
        text:
          "Asegurate de que todo sea correcto, tendrás 24h. para cancelarlo si cambias de opinión, mientras no dea una contestación el abogado",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, estoy seguro!",
        cancelButtonText: "No, cancelar!",
        reverseButtons: true,
      });
      if (result.value) {
        try {
          let token = localStorage.getItem("AUTH_TOKEN_KEY");
          axios.defaults.headers.common["Authorization"] = token;
          const response = await axios.post(
            process.env.VUE_APP_BACK_URL +
              "users/" +
              getIdToken(token) +
              "/processes/lawyers/" +
              this.$route.params.id,
            {
              message: this.message,
            }
          );
          Swal.fire({
            icon: "success",
            title: `${response.data.message}`,
          });
          window.history.back();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: `${error.response.data.message}`,
          });
        }
      } else {
        Swal.fire({
          title: "Apertura de proceso cancelada",
          icon: "error",
        });
      }
    },
    // FUNCIÓN PARA VOLVER PARA ATRÁS
    goBack() {
      window.history.back();
    },
  },
};
</script>

<style scoped>
div#addProcess {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5rem;
}
h1 {
  padding: 1.5rem;
}
textarea {
  outline: none;
  width: 80%;
  height: 200px;
  padding: 0.5rem;
}
button#send {
  outline: none;
  margin-top: 1rem;
  margin-bottom: 3rem;
  font-size: 0.7rem;
  border-radius: 20px;
  box-shadow: 5px 5px 30px var(--button) inset;
}

@media (min-width: 700px) {
  textarea {
    height: 400px;
    font-size: 1.2rem;
  }
  button#send {
    font-size: 0.9rem;
  }
}

@media (min-width: 1000px) {
  textarea {
    width: 60%;
    height: 550px;
    font-size: 1.3rem;
  }
  button#send {
    font-size: 1rem;
  }
}
</style>
