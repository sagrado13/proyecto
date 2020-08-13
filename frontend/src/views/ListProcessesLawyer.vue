<template>
  <div>
    <div id="listProcesses" v-show="seeListProcesses">
      <h1>Tus Procesos</h1>
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
      <listprocesseslawyercomp v-on:id="getProcess" :processes="processes" />
    </div>
    <div v-show="!seeListProcesses">
      <button id="back" @click="returnProcesses()">🔙</button>
      <div id="getProcess">
        <h2>Proceso Nº{{ idProcess }}</h2>
        <getprocesslawyercomp v-on:data="updateProcess" :process="process" />
      </div>
    </div>
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
      process: {},
      statusProcess: "",
    };
  },
  methods: {
    // FUNCIÓN PARA OBTENER LISTADO DE PROCESOS DE ABOGADO
    async listProcesses() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        this.idLawyer = getIdToken(token);
        const response = await axios.get(
          "http://localhost:3000/lawyers/" + this.idLawyer + "/list/processes",
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
      }
    },
    // FUNCIÓN PARA VOLVER ATRÁS DEL GETPROCESS
    returnProcesses() {
      this.seeListProcesses = true;
    },
    // FUNCIÓN PARA OBTENER DATOS DE UN PROCESO DETERMINADO
    async getProcess(processId) {
      try {
        this.idProcess = processId;
        this.seeListProcesses = false;
        const response = await axios.get(
          "http://localhost:3000/lawyers/" +
            this.idLawyer +
            "/processes/" +
            this.idProcess
        );
        this.process = response.data.data[0];
      } catch (error) {
        console.log(error);
      }
    },
    // FUNCIÓN PARA ACTUALIZAR EL ESTADO DE UN PROCESO
    async updateProcess(processData) {
      try {
        const response = await axios.put(
          "http://localhost:3000/lawyers/" +
            this.idLawyer +
            "/processes/" +
            this.idProcess +
            "/edit"
        );
        location.reload();
        console.log(response.data);
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
  margin-bottom: 2rem;
}
div#order select {
  background-color: black;
  color: white;
}
div#getProcess {
  border: 1px solid white;
  margin: 0.5rem;
  margin-bottom: 2rem;
}
button#back {
  display: flex;
}
</style>