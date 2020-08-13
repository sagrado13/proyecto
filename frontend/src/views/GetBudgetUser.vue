<template>
  <div>
    <button id="back">
      <router-link :to="{ name: 'ListProcessesUser' }">🔙</router-link>
    </button>
    <div id="main">
      <h1>Presupuesto Nº{{ idBudget }}</h1>
      <div v-show="showButton">
        <fieldset>
          <legend>Acepta o rechaza el presupuesto</legend>
          <input v-model="statusBudget" type="radio" name="aceptar" value="aceptado" />
          <label>Aceptar</label>
          <input v-model="statusBudget" type="radio" name="rechazar" value="rechazado" />
          <label>Rechazar</label>
          <button id="send" @click="editBudget()">Enviar</button>
        </fieldset>
      </div>
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
      budget: {},
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
        axios.defaults.headers.common["Authorization"] = `${token}`;
        this.idProcess = this.$route.params.id;
        this.idUser = getIdToken(token);
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
        location.reload();
        console.log(response);
      } catch (error) {
        console.log(error.response.data.message);
      }
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
  border: 1px solid white;
  margin: 0.5rem;
  margin-bottom: 2rem;
  padding: 0.3rem;
  font-size: 0.8rem;
}
button#back {
  outline: none;
  display: flex;
}
div fieldset {
  width: 80%;
  margin: 0 auto;
}
label {
  margin-right: 1rem;
}
button#send {
  outline: none;
  margin: 0.2rem;
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
  padding-left: 0.2rem;
  padding-right: 0.2rem;
  box-shadow: 5px 5px 30px white inset;
  border-radius: 20px;
}

@media (min-width: 700px) {
  div#main {
    font-size: 0.9rem;
  }
  button#back {
    font-size: 1.25rem;
  }
  div fieldset {
    width: 50%;
  }
  button#send {
    margin: 0.5rem;
    padding-left: 0.3rem;
    padding-right: 0.3rem;
    font-size: 0.9rem;
  }
}
</style>
