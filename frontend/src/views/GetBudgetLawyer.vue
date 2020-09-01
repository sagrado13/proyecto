<template>
  <div v-if="isLoaded">
    <!-- Declaramos vue-headful -->
    <vue-headful title="Datos del presupuesto" />

    <!-- BOTÓN DE VOLVER ATRÁS -->
    <button id="back">
      <router-link :to="{ name: 'ListProcessesLawyer', params: { id: this.idLawyer }}">
        <img src="../assets/deshacer.svg" />
      </router-link>
    </button>

    <div id="main">
      <h1>Presupuesto Nº{{ idBudget }}</h1>

      <!-- MODAL PARA EDITAR EL MENSAJE DEL PRESUPUESTO -->
      <div v-if="seeModal" class="modal">
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

      <!-- PRESUPUESTO SELECCIONADO CON BOTONES EDITAR Y BORRAR SEGÚN UNAS CONDICIONES -->
      <getbudgetlawyercomp :budget="budget" />
      <div id="send">
        <button
          :class="{ hide: budget.status_budget !== 'pendiente de respuesta'}"
          @click="seeModal =! seeModal"
        >Editar</button>
        <button
          v-if="budget.status_budget === 'pendiente de respuesta' || isAdmin === true"
          id="delete"
          @click="deleteBudget()"
        >Borrar</button>
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
import { checkIsAdmin } from "../api/utils.js";
// Importamos el componente GetBudgetLawyerComp
import getbudgetlawyercomp from "@/components/GetBudgetLawyerComp.vue";

export default {
  name: "GetBudgetLawyer",
  components: {
    getbudgetlawyercomp,
  },
  data() {
    return {
      budget: null,
      idLawyer: "",
      idProcess: "",
      idBudget: "",
      customerName: "",
      customerSurname: "",
      message: "",
      seeModal: false,
      isAdmin: "",
    };
  },
  computed: {
    isLoaded() {
      return this.budget !== null;
    },
  },
  methods: {
    // FUNCIÓN PARA OBTENER DATOS DE UN PRESUPUESTO DETERMINADO
    async getBudget(idProcess) {
      try {
        if (idProcess) {
          this.idProcess = idProcess;
        } else {
          this.idProcess = this.$route.params.id;
        }
        this.isAdmin = checkIsAdmin();
        this.idLawyer = this.$route.params.idLawyer;
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.get(
          "http://localhost:3000/lawyers/" +
            this.idLawyer +
            "/process/" +
            this.idProcess
        );
        if (response.data.data[0].message_budget !== null) {
          this.message = response.data.data[0].message_budget;
        }
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
        this.seeModal = false;
        this.getBudget(this.idProcess);
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },
    // FUNCIÓN PARA ELIMINAR PRESUPUESTO
    async deleteBudget() {
      const result = await Swal.fire({
        title: "Estas seguro de que quieres eliminar el presupuesto",
        text: "Una vez eliminado no se podrá recuperar",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, estoy seguro!",
        cancelButtonText: "No, cancelar!",
        reverseButtons: true,
      });
      if (result.value) {
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
          Swal.fire({
            title: "El presupuesto ha sido borrado correctamente",
            icon: "success",
          });
          window.history.back();
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: `${error.response.data.message}`,
          });
        }
      } else {
        Swal.fire({
          title: "Borrado de presupuesto cancelado",
          icon: "error",
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
  padding: 0.3rem;
  font-size: 0.8rem;
}
div#send {
  display: flex;
  justify-content: space-between;
}
div#send button {
  outline: none;
  min-width: 100px;
  box-shadow: 5px 5px 30px var(--button) inset;
  border-radius: 20px;
}
div#send button#delete {
  box-shadow: 5px 5px 30px red inset;
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
  background: rgba(252, 249, 249, 0.9);
}
.modalBox {
  background: #fefefe;
  margin: 2% auto;
  padding: 1rem;
  width: 80%;
  border: 1px solid #888;
  background: var(--button);
}
.modal button {
  outline: none;
  box-shadow: 5px 5px 30px var(--button) inset;
  border-radius: 20px;
  margin: 0.5rem;
}
textarea {
  width: 80%;
  font-size: 0.8rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
}

@media (min-width: 700px) {
  div#main {
    font-size: 0.9rem;
  }
  div#send button {
    font-size: 0.9rem;
  }
  textarea {
    font-size: 1rem;
    width: 90%;
  }
  div.modal button {
    font-size: 0.9rem;
  }
  div.modal legend {
    font-size: 1rem;
  }
}

@media (min-width: 1000px) {
  div#main {
    width: 50%;
    display: inline-block;
  }
  div#send button {
    font-size: 1rem;
  }
  textarea {
    font-size: 1rem;
  }
}
</style>