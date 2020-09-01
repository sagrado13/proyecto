<template>
  <div>
    <!-- Declaramos vue-headful -->
    <vue-headful title="Tus procesos" />

    <!-- SPINNER -->
    <loaderspinner :is-loading="!isLoaded">
      <div v-if="seeListProcesses">
        <h1>Tus Procesos</h1>

        <!-- ORDENACIÓN -->
        <div id="order" @click="listProcesses">
          <legend>Ordenar por:</legend>
          <select v-model="order" name="order">
            <option value>Estado</option>
            <option value="creationDate">Fecha de solicitud</option>
          </select>
          <select v-model="direction" name="direction">
            <option value>Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>

        <!-- LISTADO DE PROCESOS DEL USUARIO -->
        <listprocessesusercomp @data="getProcess" @id="getIdProcessRating" :processes="processes" />
      </div>
      <div v-if="!seeListProcesses">
        <!-- BOTÓN DE VOLVER ATRÁS -->
        <button id="back" @click="returnProcesses()">
          <img src="../assets/deshacer.svg" />
        </button>

        <!-- DATOS DEL PROCESO DETERMINADO -->
        <div id="getProcess">
          <h2>Proceso Nº {{ idProcess }}</h2>
          <getprocessusercomp @data="showObservations" @delete="deleteProcess" :process="process" />

          <!-- MODAL PARA EDITAR PROCESO -->
          <div v-if="seeModal" class="modal">
            <div class="modalBox">
              <h3>Editar observaciones del proceso Nº {{ idProcess }}:</h3>
              <textarea
                placeholder="Observaciones"
                v-model="observations"
                name="observations"
                cols="30"
                rows="15"
              ></textarea>
              <button @click="seeModal = !seeModal">Cancelar</button>
              <button @click="updateProcess()">Actualizar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL PARA VOTAR PROCESO -->
      <div id="rating" v-if="seeModalRating" class="modal">
        <div class="modalBox">
          <h3>
            Puntuación del proceso Nº {{ processRatingId }}, resuelto por
            {{ lawyerRating }}
          </h3>
          <star-rating v-model="rating" :star-size="35" :inline="true" :glow="5"></star-rating>
          <textarea v-model="opinion" name="opinion" cols="40" rows="10" placeholder="Opinión"></textarea>
          <button @click="cancellRating()">Cancelar</button>
          <button @click="ratingProcess()">Votar</button>
        </div>
      </div>
    </loaderspinner>
  </div>
</template>

<script>
// Importamos axios
import axios from "axios";
// Importamos sweetalert2
import Swal from "sweetalert2";
// Importamos el componente ListProcessesUserComp
import listprocessesusercomp from "@/components/ListProcessesUserComp.vue";
// Importamos el componente GetProcessUserComp
import getprocessusercomp from "@/components/GetProcessUserComp.vue";
// Importamos LoaderSpinner
import loaderspinner from "@/components/LoaderSpinner.vue";
// IMPORTAMOS FUNCIONES
import { getIdToken } from "../api/utils";
import { checkIsAdmin } from "../api/utils.js";
export default {
  name: "ListProcessesUser",
  components: {
    listprocessesusercomp,
    getprocessusercomp,
    loaderspinner,
  },
  data() {
    return {
      processes: [],
      seeListProcesses: true,
      order: "",
      direction: "",
      idProcess: "",
      idUser: "",
      process: null,
      seeModal: false,
      observations: "",
      rating: 0,
      opinion: "",
      seeModalRating: false,
      processRatingId: "",
      lawyerRating: "",
    };
  },
  computed: {
    isLoaded() {
      return this.processes.length > 0 || this.process === null;
    },
  },
  methods: {
    // FUNCIÓN PARA OBTENER LISTADO DE PROCESOS DE USUARIO
    async listProcesses(idUser) {
      try {
        if (this.$route.params.id && checkIsAdmin() === true) {
          let token = localStorage.getItem("AUTH_TOKEN_KEY");
          axios.defaults.headers.common["Authorization"] = `${token}`;
          this.idUser = this.$route.params.id;
        } else {
          let token = localStorage.getItem("AUTH_TOKEN_KEY");
          axios.defaults.headers.common["Authorization"] = `${token}`;
          this.idUser = getIdToken(token);
        }
        const response = await axios.get(
          "http://localhost:3000/users/" + this.idUser + "/list/processes",
          {
            params: {
              order: this.order,
              direction: this.direction,
            },
          }
        );
        this.processes = response.data.data;
      } catch (error) {
        console.log(error.response.data);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
        window.history.back();
      }
    },
    // FUNCIÓN PARA VOLVER ATRÁS DEL GETPROCESS
    returnProcesses() {
      this.seeListProcesses = true;
    },
    // FUNCIÓN PARA OBTENER DATOS DE UN PROCESO DETERMINADO
    async getProcess(idProcess) {
      try {
        this.idProcess = idProcess;
        this.seeListProcesses = false;
        const response = await axios.get(
          "http://localhost:3000/users/" +
            this.idUser +
            "/processes/" +
            this.idProcess
        );
        this.process = response.data.data[0];
      } catch (error) {
        console.log(error);
      }
    },
    //FUNCIÓN PARA MOSTRAR LAS OBSERVACIONES DEL PROCESO
    showObservations(processData) {
      this.observations = processData.observations;
      this.seeModal = true;
    },
    // FUNCIÓN PARA ACTUALIZAR LAS OBSERVACIONES DE UN PROCESO
    async updateProcess() {
      try {
        const response = await axios.put(
          "http://localhost:3000/users/" +
            this.idUser +
            "/processes/" +
            this.idProcess +
            "/edit",
          {
            observations: this.observations,
          }
        );
        this.seeModal = false;
        this.getProcess(this.idProcess);
        console.log(response);
      } catch (error) {
        console.log(error.response.data);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },
    // FUNCIÓN PARA BORRAR PROCESO
    async deleteProcess() {
      const result = await Swal.fire({
        title: "Estas seguro de que quieres eliminar este proceso?",
        text: "Una vez sea eliminado no podrás volver a recuperarlo",
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
              "/delete"
          );
          Swal.fire({
            icon: "success",
            title: `${response.data.message}`,
          });
          this.seeListProcesses = true;
          this.listProcesses((this.$route.params.id = this.idUser));
        } catch (error) {
          console.log(error.response.data);
          Swal.fire({
            icon: "error",
            title: `${error.response.data.message}`,
          });
        }
      } else {
        Swal.fire({
          title: "Borrado de proceso cancelado",
          icon: "error",
        });
      }
    },
    // FUNCIÓN PARA MOSTAR EL MODAL PARA VOTAR PROCESO DETERMINADO
    getIdProcessRating(processData) {
      this.processRatingId = processData.id;
      this.lawyerRating = processData.law_firm;
      this.seeListProcesses = false;
      this.seeModalRating = true;
    },
    // FUNCIÓN PARA CANCELAR LA VOTACIÓN
    cancellRating() {
      this.seeModalRating = false;
      this.seeListProcesses = true;
    },
    // FUNCIÓN PARA VOTAR
    async ratingProcess() {
      try {
        if (this.opinion.length > 0) {
          const response = await axios.put(
            "http://localhost:3000/users/" +
              this.idUser +
              "/processes/" +
              this.processRatingId +
              "/budgets",
            {
              rating: this.rating,
              opinion: this.opinion,
            }
          );
          this.getProcess(this.idProcess);
          this.seeModalRating = false;
          Swal.fire({
            icon: "success",
            title: `${response.data.message}`,
          });
        } else {
          const response = await axios.put(
            "http://localhost:3000/users/" +
              this.idUser +
              "/processes/" +
              this.processRatingId +
              "/budgets",
            {
              rating: this.rating,
            }
          );
          this.seeModalRating = false;
          this.getProcess(this.idProcess);
          Swal.fire({
            icon: "success",
            title: `${response.data.message}`,
          });
        }
      } catch (error) {
        console.log(error.response.data.message);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },
  },
  // HOOK
  created() {
    this.listProcesses();
  },
};
</script>

<style scoped>
h1 {
  text-decoration: underline;
  margin: 1rem;
}
div#order select {
  background-color: var(--bright);
  color: var(--dark);
}
div#getProcess {
  border: 1px solid var(--dark);
  background-color: var(--bright);
  margin: 0.5rem;
  padding: 0.5rem;
  margin-bottom: 2rem;
}
h2 {
  text-decoration: underline;
  margin: 1rem;
}
button {
  outline: none;
  box-shadow: 5px 5px 30px var(--button) inset;
}
button#back {
  box-shadow: none;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background: rgba(252, 249, 249, 0.9);
}
.modalBox {
  background: #fefefe;
  margin: 0 auto;
  padding: 1rem;
  width: 80%;
  border: 1px solid var(--dark);
  background: var(--button);
}
.modalBox textarea {
  width: 90%;
}

.modal button {
  border-radius: 20px;
  margin: 0.5rem;
}
div#rating {
  display: flex;
  align-items: center;
}
div#rating h3 {
  margin-bottom: 2rem;
}
div#rating textarea {
  outline: none;
  margin-top: 0.5rem;
  font-size: 0.8rem;
}
div#rating button {
  font-size: 0.8rem;
}
div#rating button:last-of-type {
  box-shadow: 5px 5px 30px yellowgreen inset;
}

@media (min-width: 700px) {
  div#order select {
    font-size: 0.9rem;
    padding: 0.1rem;
  }
  button#back {
    font-size: 1.25rem;
  }
  div.modal button {
    font-size: 0.9rem;
  }
  div.modal textarea {
    outline: none;
    margin-top: 0.7rem;
    width: 90%;
    font-size: 1rem;
  }
  div.modal {
    display: flex;
    align-items: center;
  }
  div#rating textarea {
    font-size: 1rem;
  }
  div#rating button {
    font-size: 0.9rem;
  }

  @media (min-width: 1000px) {
    div#order select {
      font-size: 1rem;
    }
    button#back {
      font-size: 1.4rem;
    }
    div#getProcess {
      max-width: 70%;
      display: inline-block;
    }
    .modalBox {
      width: 55%;
    }
    div.modal button {
      font-size: 1rem;
    }
    div.modal textarea {
      width: 90%;
      font-size: 1.25rem;
    }
    div#rating h3 {
      font-size: 1.4rem;
    }
    div#rating textarea {
      font-size: 1.25rem;
    }
    div#rating button {
      font-size: 1rem;
    }
  }
}
</style>
