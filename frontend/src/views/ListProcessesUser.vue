<template>
  <div>
    <div v-show="seeListProcesses">
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
      <listprocessesusercomp
        v-on:data="getProcess"
        v-on:id="getIdProcessRating"
        :processes="processes"
      />
    </div>
    <div v-show="!seeListProcesses">
      <button id="back" @click="returnProcesses()">🔙</button>
      <div id="getProcess">
        <h2>Proceso Nº {{ idProcess }}</h2>
        <getprocessusercomp
          v-on:data="showObservations"
          v-on:delete="deleteProcess"
          :process="process"
        />
        <!-- MODAL PARA EDITAR PROCESO -->
        <div v-show="seeModal" class="modal">
          <div class="modalBox">
            <h3>Solamente puedes editar observaciones:</h3>
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
    <div id="rating" v-show="seeModalRating" class="modal">
      <div class="modalBox">
        <h3>Puntuación para {{ lawyerRating }}</h3>
        <star-rating v-model="rating" :star-size="25" :inline="true"></star-rating>
        <textarea v-model="opinion" name="opinion" cols="40" rows="10" placeholder="Opinion"></textarea>
        <button @click="cancellRating()">Cancelar</button>
        <button @click="ratingProcess()">Votar</button>
      </div>
    </div>
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
// IMPORTAMOS FUNCIONES
import { getIdToken } from "../api/utils";
export default {
  name: "ListProcessesUser",
  components: {
    listprocessesusercomp,
    getprocessusercomp,
  },
  data() {
    return {
      processes: [],
      seeListProcesses: true,
      order: "",
      direction: "",
      idProcess: "",
      idUser: "",
      process: {},
      seeModal: false,
      observations: "",
      rating: 0,
      opinion: "",
      seeModalRating: false,
      processRatingId: "",
      lawyerRating: "",
    };
  },
  methods: {
    // FUNCIÓN PARA OBTENER LISTADO DE PROCESOS DE USUARIO
    async listProcesses() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        this.idUser = getIdToken(token);
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
        console.log(error);
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
        location.reload();
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    },
    // FUNCIÓN PARA BORRAR PROCESO
    async deleteProcess() {
      try {
        const response = await axios.put(
          "http://localhost:3000/users/" +
            this.idUser +
            "/processes/" +
            this.idProcess +
            "/delete"
        );
        location.reload();
        console.log(response);
      } catch (error) {
        console.log(error.response.data);
      }
    },
    // FUNCIÓN PARA MOSTAR EL MODAL PARA VOTAR PROCESO DETERMINADO
    getIdProcessRating(processData) {
      this.processRatingId = processData.id;
      this.lawyerRating = processData.law_firm;
      this.seeListProcesses = false;
      this.seeModalRating = true;
    },
    // FUNCIÓN PARA VOLVER PARA ATRÁS
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
          console.log(response);
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
  background-color: black;
  color: white;
}
div#getProcess {
  border: 1px solid white;
  margin: 0.5rem;
  margin-bottom: 2rem;
}
h2 {
  text-decoration: underline;
  margin: 1rem;
}
button {
  outline: none;
  box-shadow: 5px 5px 30px white inset;
}
button#back {
  display: flex;
}
div.modal button {
  border-radius: 20px;
  margin: 0.5rem;
}
.modal {
  position: fixed;
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
  padding: 0.3rem;
  font-size: 0.8rem;
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
    padding: 0.3rem;
  }
  div.modal textarea {
    outline: none;
    margin-top: 0.7rem;
    width: 90%;
    font-size: 1rem;
  }
  .modal {
    display: flex;
    align-items: center;
  }
  div#rating textarea {
    font-size: 1rem;
  }
  div#rating button {
    padding-left: 0.4rem;
    padding-right: 0.4rem;
    font-size: 0.9rem;
  }
}
</style>
