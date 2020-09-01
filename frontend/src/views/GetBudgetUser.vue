<template>
  <div>
    <!-- Declaramos vue-headful -->
    <vue-headful title="Datos del presupuesto" />

    <!-- BOTÓN DE VOLVER ATRÁS -->
    <button id="back">
      <router-link :to="{ name: 'ListProcessesUser', params: { id: this.idUser } }">
        <img src="../assets/deshacer.svg" />
      </router-link>
    </button>

    <!-- PRESUPUESTO -->
    <div id="main">
      <h1>Presupuesto Nº{{ idBudget }}</h1>
      <div v-if="showButton">
        <!-- ACEPTAR O RECHARZAR EL PRESUPUESTO -->
        <fieldset>
          <legend>Acepta o rechaza el presupuesto</legend>
          <input v-model="statusBudget" type="radio" name="aceptar" value="aceptado" />
          <label>Aceptar</label>
          <input v-model="statusBudget" type="radio" name="rechazar" value="rechazado" />
          <label>Rechazar</label>
          <button id="send" @click="editBudget()">Enviar</button>
        </fieldset>
      </div>
      <!-- DATOS DEL PRESUPUESTO SELECIONADO -->
      <getbudgetusercomp :budget="budget" />
    </div>
  </div>
</template>

<script>
// Importamos axios
import axios from "axios";
// Importamos sweetalert2
import Swal from "sweetalert2";
// IMPORTAMOS FUNCIONES
import { getIdToken } from "../api/utils";
// Importamos el componente GetBudgetUserComp
import getbudgetusercomp from "@/components/GetBudgetUserComp.vue";
export default {
  name: "GetBudgetUser",
  components: {
    getbudgetusercomp,
  },
  data() {
    return {
      budget: null,
      idUser: "",
      idProcess: "",
      idBudget: "",
      statusBudget: "",
      showButton: true,
    };
  },
  methods: {
    // FUNCIÓN PARA OBTENER DATOS DE UN PRESUPUESTO DETERMINADO
    async getBudget() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = token;
        this.idProcess = this.$route.params.id;
        if (!this.idProcess) {
          return this.$router.push("/processes-user/");
        }
        this.idUser = this.$route.params.idUser;
        const response = await axios.get(
          "http://localhost:3000/users/" +
            this.idUser +
            "/process/" +
            this.idProcess
        );
        this.budget = response.data.data[0];
        this.idBudget = response.data.data[0].id;
        if (
          response.data.data[0].status_budget === `aceptado` ||
          response.data.data[0].status_budget === `rechazado`
        ) {
          this.showButton = false;
        }
      } catch (error) {
        console.log(error);
        if (
          error.response.data.message ===
          `No tienes ningún presupuesto para este proceso`
        ) {
          window.history.back();
        }
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },
    // FUNCIÓN PARA ACEPTAR O RECHAZAR PRESUPUESTO POR USUARIO
    async editBudget() {
      try {
        if (!this.statusBudget) {
          throw new Error(`Tienes que seleccionar una opción`);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: `${error.message}`,
        });
        return;
      }
      const result = await Swal.fire({
        title: `Estas seguro de que quieres dar por ${this.statusBudget} el presupuesto?`,
        text: "Una vez emitida la respuesta no podrás cambiarla",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, estoy seguro!",
        cancelButtonText: "No, cancelar!",
        reverseButtons: true,
      });
      if (result.value) {
        try {
          const response = await axios.put(
            "http://localhost:3000/users/" +
              this.idUser +
              "/processes/" +
              this.idProcess +
              "/budgets/" +
              this.idBudget +
              "/edit",
            {
              status: this.statusBudget,
            }
          );
          this.$router.push({
            name: "ListProcessesUser",
            params: { id: this.idUser },
          });
          Swal.fire({
            title: `Presupuesto ${this.statusBudget}`,
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: `${error.response.data.message}`,
          });
        }
      } else {
        Swal.fire({
          title: "Respuesta cancelada",
          icon: "error",
        });
      }
    },
    // FUNCIÓN PARA VOLVER PARA ATRÁS
    goBack() {
      window.history.back();
    },
  },
  created() {
    this.getBudget();
  },
};
</script>

<style scoped>
h1 {
  text-decoration: underline;
  margin-top: 1rem;
  margin-bottom: 2rem;
}
div#main {
  border: 1px solid var(--dark);
  background-color: var(--bright);
  margin: 0.5rem;
  margin-bottom: 2rem;
  padding: 0.5rem;
  font-size: 0.8rem;
}
div fieldset {
  width: 300px;
  margin: 0 auto;
  border-radius: 20px;
  margin-bottom: 2rem;
}
label {
  margin-right: 1rem;
}
input {
  cursor: pointer;
}
button#send {
  outline: none;
  margin: 0.2rem;
  box-shadow: 5px 5px 30px var(--button) inset;
  border-radius: 20px;
}

@media (min-width: 700px) {
  div#main {
    font-size: 0.9rem;
  }
  div fieldset {
    width: 350px;
  }
  button#send {
    margin: 0.5rem;
    font-size: 0.9rem;
  }
}

@media (min-width: 1000px) {
  div#main {
    width: 50%;
    display: inline-block;
  }
  div fieldset {
    width: 400px;
  }
  button#send {
    font-size: 1rem;
  }
}
</style>
