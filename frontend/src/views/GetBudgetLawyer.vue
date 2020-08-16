<template>
  <div>
    <button id="back">
      <router-link :to="{ name: 'ListProcessesLawyer' }">🔙</router-link>
    </button>
    <div id="main">
      <h1>Presupuesto Nº{{ idBudget }}</h1>
      <div v-show="seeModal" class="modal">
        <div class="modalBox">
          <legend>Mensaje para {{ customerName }} {{ customerSurname }}</legend>
          <textarea
            v-model="message"
            placeholder="Mensaje para cliente"
            name="message"
            cols="40"
            rows="20"
          ></textarea>
          <button @click="editBudget()">Enviar</button>
          <button @click="seeModal =! seeModal">Cancelar</button>
        </div>
      </div>
      <getbudgetlawyercomp :budget="budget" />
      <div id="send">
        <!-- :class="{ hide: budget.status_budget !== 'pendiente'}" -->
        <button @click="seeModal =! seeModal">Editar</button>
        <!-- :class="{ hide: budget.status_budget === 'aceptado' }" -->
        <button id="delete" @click="deleteBudget()">Borrar</button>
      </div>
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
// Importamos el componente GetBudgetLawyerComp
import getbudgetlawyercomp from "@/components/GetBudgetLawyerComp.vue";
export default {
  name: "GetBudgetLawyer",
  components: {
    getbudgetlawyercomp,
  },
  data() {
    return {
      budget: {},
      idLawyer: "",
      idProcess: "",
      idBudget: "",
      customerName: "",
      customerSurname: "",
      message: "",
      seeModal: false,
    };
  },
  methods: {
    // FUNCIÓN PARA OBTENER DATOS DE UN PRESUPUESTO DETERMINADO
    async getBudget() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        this.idProcess = this.$route.params.id;
        this.idLawyer = getIdToken(token);
        const response = await axios.get(
          "http://localhost:3000/lawyers/" +
            this.idLawyer +
            "/process/" +
            this.idProcess
        );
        this.budget = response.data.data[0];
        this.idBudget = response.data.data[0].id;
        this.customerName = response.data.data[0].name;
        this.customerSurname = response.data.data[0].surname;
      } catch (error) {
        console.log(error);
        if (
          error.response.data.message ===
          `No tienes ningún presupuesto para este proceso`
        ) {
        }
        window.history.back();
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },
    // FUNCIÓN PARA EDITAR MENSAJE DE PRESUPUESTO POR ABOGADO
    async editBudget() {
      try {
        const response = await axios.put(
          "http://localhost:3000/lawyers/" +
            this.idLawyer +
            "/processes/" +
            this.idProcess +
            "/budgets/" +
            this.idBudget +
            "/edit",
          {
            message: this.message,
          }
        );
        location.reload();
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },
    async deleteBudget() {
      try {
        const response = await axios.put(
          "http://localhost:3000/lawyers/" +
            this.idLawyer +
            "/processes/" +
            this.idProcess +
            "/budgets/" +
            this.idBudget +
            "/delete"
        );
        console.log(response);
        window.history.back();
        Swal.fire({
          title: "El presupuesto ha sido borrado correctamente",
          icon: "success",
        });
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
    this.getBudget();
  },
};
</script>

<style scoped>
button#back {
  all: unset;
  outline: none;
  display: flex;
}
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
div#send {
  display: flex;
  justify-content: space-between;
}
div#send button {
  outline: none;
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
  padding-left: 0.2rem;
  padding-right: 0.2rem;
  box-shadow: 5px 5px 30px white inset;
  border-radius: 20px;
}
div#send button#delete {
  background: red;
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
  background: rgba(0, 0, 0, 0.9);
}
.modalBox {
  background: #fefefe;
  margin: 2% auto;
  padding: 1rem;
  width: 80%;
  border: 1px solid #888;
  background: rgb(0, 0, 0.5);
}
.modal button {
  outline: none;
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
  padding-left: 0.2rem;
  padding-right: 0.2rem;
  box-shadow: 5px 5px 30px white inset;
  border-radius: 20px;
  margin: 0.5rem;
}
textarea {
  font-size: 0.8rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

@media (min-width: 700px) {
  button#back {
    font-size: 1.25rem;
  }
  div#main {
    font-size: 0.9rem;
  }
  div#send button {
    padding-left: 0.3rem;
    padding-right: 0.3rem;
    font-size: 0.9rem;
  }
  textarea {
    font-size: 1rem;
    width: 90%;
  }
  div.modal button {
    font-size: 0.9rem;
    padding: 0.3rem;
  }
  div.modal legend {
    font-size: 1rem;
  }
}

@media (min-width: 1000px) {
  button#back {
    font-size: 1.4rem;
  }
  div#main {
    max-width: 70%;
    display: inline-block;
  }
  div#send button {
    font-size: 1rem;
  }
  textarea {
    font-size: 1rem;
    width: 100%;
  }
}
</style>