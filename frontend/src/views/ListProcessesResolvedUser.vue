<template>
  <div id="listProcesses">
    <!-- Declaramos vue-headful -->
    <vue-headful title="Tus procesos resueltos" />

    <!-- SPINNER -->
    <loaderspinner>
      <div v-if="seeListProcesses">
        <h1>Tus Procesos Resueltos</h1>

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
        <listprocessesresolvedusercomp
          @data="getProcess"
          @id="getIdProcessRating"
          :processesResolved="processesResolved"
        />
      </div>
      <div v-if="!seeListProcesses">
        <!-- BOTÓN DE VOLVER ATRÁS -->
        <button id="back" @click="returnProcesses()">
          <img src="../assets/deshacer.svg" />
        </button>

        <!-- DATOS DEL PROCESO DETERMINADO -->
        <div id="getProcess">
          <h2>Proceso Nº {{ idProcess }}</h2>
          <getprocessusercomp @delete="deleteProcess" :process="process" />
        </div>
      </div>

      <!-- MODAL PARA VOTAR PROCESO -->
      <div id="rating" v-if="seeModalRating" class="modal">
        <div class="modalBox">
          <h3>
            Puntuación del proceso Nº {{ idProcess }}, resuelto por
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
// Importamos el componente ListProcessesResolvedUserComp
import listprocessesresolvedusercomp from "@/components/ListProcessesResolvedUserComp.vue";
// Importamos el componente GetProcessUserComp
import getprocessusercomp from "@/components/GetProcessUserComp.vue";
// IMPORTAMOS FUNCIONES
import { getIdToken } from "../api/utils";
import { checkIsAdmin } from "../api/utils.js";
export default {
  name: "ListProcessesResolvedUser",
  components: {
    listprocessesresolvedusercomp,
    getprocessusercomp,
  },
  data() {
    return {
      processesResolved: [],
      seeListProcesses: true,
      order: "",
      direction: "",
      idProcess: "",
      idUser: "",
      process: null,
      rating: 0,
      opinion: "",
      seeModalRating: false,
      lawyerRating: "",
    };
  },
  computed: {
    /*     isLoaded() {
      return this.processesResolved.length > 0 || this.process === null;
    }, */
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
          process.env.VUE_APP_BACK_URL +
            "users/" +
            this.idUser +
            "/list/processes",
          {
            params: {
              order: this.order,
              direction: this.direction,
            },
          }
        );
        this.processesResolved = response.data.processSolvedUser;
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
          process.env.VUE_APP_BACK_URL +
            "users/" +
            this.idUser +
            "/processes/" +
            this.idProcess
        );
        this.process = response.data.data[0];
      } catch (error) {
        console.log(error);
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
            process.env.VUE_APP_BACK_URL +
              "users/" +
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
      this.idProcess = processData.id;
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
            process.env.VUE_APP_BACK_URL +
              "users/" +
              this.idUser +
              "/processes/" +
              this.idProcess +
              "/budgets",
            {
              rating: this.rating,
              opinion: this.opinion,
            }
          );
          this.listProcesses();
          this.seeModalRating = false;
          this.seeListProcesses = true;
          Swal.fire({
            icon: "success",
            title: `${response.data.message}`,
          });
        } else {
          const response = await axios.put(
            process.env.VUE_APP_BACK_URL +
              "users/" +
              this.idUser +
              "/processes/" +
              this.idProcess +
              "/budgets",
            {
              rating: this.rating,
            }
          );
          this.seeModalRating = false;
          this.seeListProcesses = true;
          this.listProcesses();
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
div#listProcesses {
  margin-bottom: 5rem;
}
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
  background: var(--button);
  margin: 0 auto;
  padding: 1rem;
  width: 80%;
  border: 1px solid var(--dark);
}
.modalBox textarea {
  width: 90%;
  padding: 0.2rem;
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
