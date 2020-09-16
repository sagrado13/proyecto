<template>
  <div id="listProcesses">
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

        <!-- LISTADO DE PROCESOS DEL ABOGADO -->
        <listprocesseslawyercomp @id="getProcess" :processes="processes" />
      </div>

      <div v-if="!seeListProcesses">
        <!-- BOTÓN DE VOLVER ATRÁS -->
        <button id="back" @click="seeListProcesses = !seeListProcesses">
          <img src="../assets/deshacer.svg" />
        </button>

        <!-- DATOS DE PROCESO DETERMINADO -->
        <div id="getProcess">
          <h2>Proceso Nº {{ idProcess }}</h2>
          <getprocesslawyercomp @data="updateProcess" :process="process" />
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
// Importamos el componente ListProcessesLawyerComp
import listprocesseslawyercomp from "@/components/ListProcessesLawyerComp.vue";
// Importamos el componente GetProcessLawyerComp
import getprocesslawyercomp from "@/components/GetProcessLawyerComp.vue";

// IMPORTAMOS FUNCIONES
import { getIdToken } from "../api/utils";
import { checkIsAdmin } from "../api/utils.js";
export default {
  name: "ListProcessesLawyer",
  components: {
    listprocesseslawyercomp,
    getprocesslawyercomp,
  },
  data() {
    return {
      idLawyer: "",
      processes: [],
      seeListProcesses: true,
      order: "",
      direction: "",
      idProcess: "",
      process: null,
      statusProcess: "",
    };
  },
  computed: {
    isLoaded() {
      return this.processes !== null || this.process !== null;
    },
  },
  methods: {
    // FUNCIÓN PARA OBTENER LISTADO DE PROCESOS DE ABOGADO
    async listProcesses(idLawyer) {
      try {
        if (this.$route.params.id && checkIsAdmin() === true) {
          this.idLawyer = this.$route.params.id;
          let token = localStorage.getItem("AUTH_TOKEN_KEY");
          axios.defaults.headers.common["Authorization"] = `${token}`;
        } else {
          let token = localStorage.getItem("AUTH_TOKEN_KEY");
          axios.defaults.headers.common["Authorization"] = `${token}`;
          this.idLawyer = getIdToken(token);
        }
        const response = await axios.get(
          process.env.VUE_APP_BACK_URL +
            "lawyers/" +
            this.idLawyer +
            "/list/processes",
          {
            params: {
              order: this.order,
              direction: this.direction,
            },
          }
        );
        this.processes = response.data.data;
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
        window.history.back();
      }
    },
    // FUNCIÓN PARA OBTENER DATOS DE UN PROCESO DETERMINADO
    async getProcess(idProcess) {
      try {
        this.idProcess = idProcess;
        this.seeListProcesses = false;
        const response = await axios.get(
          process.env.VUE_APP_BACK_URL +
            "lawyers/" +
            this.idLawyer +
            "/processes/" +
            this.idProcess
        );
        this.process = response.data.data[0];
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // FUNCIÓN PARA ACTUALIZAR EL ESTADO DE UN PROCESO
    async updateProcess(processData) {
      try {
        const response = await axios.put(
          process.env.VUE_APP_BACK_URL +
            "lawyers/" +
            this.idLawyer +
            "/processes/" +
            this.idProcess +
            "/edit"
        );
        this.getProcess(this.idProcess);
        this.listProcesses(this.idLawyer);
        Swal.fire({
          title: `${response.data.message}`,
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
    },
  },
  //HOOK
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
div#listProcesses {
  margin-bottom: 5rem;
}
div#order select {
  background-color: var(--bright);
  color: var(--dark);
}
div#getProcess {
  border: 1px solid var(--dark);
  background-color: var(--bright);
  margin: 0.5rem;
  margin-bottom: 2rem;
  padding: 0.5rem;
}
h2 {
  margin: 1rem;
  text-decoration: underline;
}

@media (min-width: 700px) {
  div#order select {
    font-size: 0.9rem;
    padding: 0.1rem;
  }
}

@media (min-width: 1000px) {
  div#order select {
    font-size: 1rem;
  }

  div#getProcess {
    max-width: 70%;
    display: inline-block;
  }
}
</style>
