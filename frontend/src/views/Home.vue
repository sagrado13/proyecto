<template>
  <div class="home">
    <!-- Declaramos vue-headful -->
    <vue-headful title="Inicio" />
    <!-- SPINNER -->
    <loaderspinner :is-loading="!isLoaded">
      <!-- NÚMERO DE ABOGADOS EN LA WEB TOTAL DE PROCESOS ABIERTOS, RESUELTOS Y EN EL AÑO EN CURSO -->
      <div id="info" v-if="showListLawyers">
        <ul>
          <li>
            <p id="quantity">
              <img src="../assets/home/totalLawyer.png" alt="Total abogados" />
              {{ totalLawyers }}
            </p>
            <p id="info">Abogados en la web</p>
          </li>
          <li>
            <p id="quantity">
              <img src="../assets/home/processes.png" alt="Archivador" />
              {{ totalProcesses }}
            </p>
            <p id="info">Procesos tratados</p>
          </li>
          <li>
            <p id="quantity">
              <img src="../assets/home/processes.png" alt="Archivador" />
              {{ totalProcessesThisYear }}
            </p>
            <p id="info">Procesos tratados en {{ year }}</p>
          </li>
          <li>
            <p id="quantity">
              <img src="../assets/home/check.png" alt="Check" />
              {{ processesSolved }}
            </p>
            <p id="info">Procesos resueltos</p>
          </li>
          <li>
            <p id="quantity">
              <img src="../assets/home/check.png" alt="Check" />
              {{ processesSolvedThisYear }}
            </p>
            <p id="info">Procesos resueltos en {{ year }}</p>
          </li>
        </ul>
      </div>

      <!-- BUSCADOR -->
      <div id="search">
        <h3>Busca el abogado que necesitas</h3>
        <!--  BUSCADOR POR ESPECIALIDAD -->
        <select v-model="speciality" name="speciality">
          <option value>Selecciona una especialidad</option>
          <option value="Derecho Civil">Derecho Civil</option>
          <option value="Derecho Penal">Derecho Penal</option>
          <option value="Derecho Comercial">Derecho Comercial</option>
          <option value="Derecho Laboral">Derecho Laboral</option>
          <option value="Derecho Tributario">Derecho Tributario</option>
          <option value="Derecho Constitucional">Derecho Constitucional</option>
          <option value="Derecho Administrativo">Derecho Administrativo</option>
          <option value="Derecho Intelectual">Derecho Intelectual</option>
          <option value="Derecho Ambiental">Derecho Ambiental</option>
        </select>
        <!-- BUSCADOR POR LOCALIDAD -->
        <select v-model="city" name="city">
          <option value>Selecciona una localidad</option>
          <option
            v-for="province in provinces"
            :key="province.id"
            :value="province"
            >{{ province }}</option
          >
        </select>
        <!-- BUSCADOR POR URGENCIA TRATANDO LOS CASOS -->
        <select v-model="urgency" name="urgency">
          <option value>Selecciona la urgencia</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
        <div id="button">
          <button @click="searchLawyer()">Buscar</button>
          <button
            @click="showListLawyers = !showListLawyers"
            v-if="!showListLawyers"
          >
            Cancelar
          </button>
        </div>
      </div>
      <!-- TOP 5 DE ABOGADOS MEJOR VALORADOS -->
      <top5lawyerscomp v-if="showListLawyers" :topLawyers="topLawyers" />
      <!-- ORDENACIÓN -->
      <div id="order" @click="searchLawyer()" v-if="!showListLawyers">
        <legend>Ordenar</legend>
        <select v-model="order" name="order">
          <option value>Nombre</option>
          <option value="voteAverage">Puntuación</option>
          <option value="city">Ciudad</option>
          <option value="urgency">Urgencia</option>
        </select>
        <select v-model="direction" name="direction">
          <option value>Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
      </div>
      <!-- LISTA DE ÚLTIMOS ABOGADOS QUE ESTUVIERON CONECTADOS -->
      <listlawyerscomp v-if="showListLawyers" :lawyers="lawyers" />
      <div v-if="!showListLawyers">
        <!-- RESULTADO DE LA BÚSQUEDA -->
        <div id="info">
          <p id="quantity">
            <img src="../assets/home/totalLawyer.png" alt="Total abogados" />
            {{ totalLawyersFound }}
          </p>
          <p id="info">Abogados encontrados</p>
        </div>
        <searchlawyerscomp :searchLawyers="searchLawyers" />
      </div>
    </loaderspinner>
  </div>
</template>

<script>
// Importamos axios
import axios from "axios";
// Importamos sweetalert2
import Swal from "sweetalert2";
// Importamos el componente ListLawyersComp
import listlawyerscomp from "@/components/ListLawyersComp.vue";
// Importamos el componente searchLawyersComp
import searchlawyerscomp from "@/components/searchLawyersComp.vue";
// Importamos el componente Top10LawyersComp
import top5lawyerscomp from "@/components/Top5LawyersComp.vue";

export default {
  name: "Home",
  components: {
    listlawyerscomp,
    searchlawyerscomp,
    top5lawyerscomp,
  },
  data() {
    return {
      lawyers: [],
      totalLawyers: "",
      idLawyer: "",
      speciality: "",
      city: "",
      urgency: "",
      order: "",
      direction: "",
      searchLawyers: [],
      totalLawyersFound: "",
      showListLawyers: true,
      provinces: [
        "A Coruña",
        "Álava",
        "Albacete",
        "Alicante",
        "Almería",
        "Asturias",
        "Ávila",
        "Badajoz",
        "Barcelona",
        "Burgos",
        "Cáceres",
        "Cádiz",
        "Cantabria",
        "Castellón",
        "Ciudad Real",
        "Córdoba",
        "Cuenca",
        "Gerona",
        "Granada",
        "Guadalajara",
        "Guipúzcoa",
        "Huelva",
        "Huesca",
        "Islas Baleares",
        "Jaén",
        "Las Palmas",
        "La Rioja",
        "León",
        "Lérida",
        "Lugo",
        "Madrid",
        "Málaga",
        "Murcia",
        "Navarra",
        "Orense",
        "Palencia",
        "Pontevedra",
        "Salamanca",
        "Santa Cruz de Tenerife",
        "Segovia",
        "Sevilla",
        "Soria",
        "Tarragona",
        "Teruel",
        "Toledo",
        "Valencia",
        "Valladolid",
        "Vizcaya",
        "Zamora",
        "Zaragoza",
      ],
      topLawyers: [],
      totalProcesses: "",
      processesSolved: "",
      totalProcessesThisYear: "",
      processesSolvedThisYear: "",
      year: "",
    };
  },
  computed: {
    isLoaded() {
      return (
        (this.lawyers.length > 0 || this.searchLawyers.length > 0) &&
        this.topLawyers.length > 0
      );
    },
  },
  methods: {
    // FUNCIÓN PARA OBTENER LISTADO DE ABOGADOS
    async listLawyers() {
      try {
        const response = await axios.get(
          process.env.VUE_APP_BACK_URL + "lawyers/list"
        );
        this.totalLawyers = response.data.data[0].total_lawyers;
        this.lawyers = response.data.lawyers;
      } catch (error) {
        console.log(error.response.data);
      }
    },
    // FUNCIÓN PARA BUSCAR ABOGADOS POR ESPECIALIDAD, CIUDAD Y URGENCIA
    async searchLawyer() {
      try {
        if (!this.speciality && !this.city && !this.urgency) {
          throw new Error(
            `Para hacer una búsqueda hay que seleccionar mínimo una opción`
          );
        }
        const response = await axios.get(
          process.env.VUE_APP_BACK_URL + "lawyers/search",
          {
            params: {
              speciality: this.speciality,
              city: this.city,
              urgency: this.urgency,
              order: this.order,
              direction: this.direction,
            },
          }
        );
        this.searchLawyers = response.data.data.result;
        this.totalLawyersFound = response.data.data.totalLawyers;
        this.showListLawyers = false;
        window.scrollTo(0, 350);
      } catch (error) {
        console.log(error);
        if (
          error.message ===
          `Para hacer una búsqueda hay que seleccionar mínimo una opción`
        ) {
          Swal.fire({
            icon: "error",
            title: `${error.message}`,
          });
          this.listLawyers();
          this.showListLawyers = true;
        } else {
          Swal.fire({
            icon: "error",
            title: `${error.response.data.message}`,
          });
        }
      }
    },
    // FUNCIÓN PARA OBTENER EL TOP DE ABOGADOS CON LAS MEJORES PUNTUACIONES
    async top10Lawyers() {
      try {
        const response = await axios.get(
          process.env.VUE_APP_BACK_URL + "lawyers/top"
        );
        this.topLawyers = response.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // FUNCIÓN PARA OBTENER TOTAL DE PROCESOS Y TOTAL DE PROCESOS RESUELTOS Y EL TOTAL EN EL AÑO EN CURSO
    async totalProcessesAndSolved() {
      try {
        const response = await axios.get(
          process.env.VUE_APP_BACK_URL + "processes/total"
        );
        this.totalProcesses = response.data.data.processes[0].total_processes;
        this.totalProcessesThisYear =
          response.data.data.processesThisYear[0].total_processes_this_year;
        this.processesSolved =
          response.data.data.processesSolved[0].total_processes_solved;
        this.processesSolvedThisYear =
          response.data.data.processesSolvedThisYear[0].total_processes_solved_this_year;
        let now = new Date();
        this.year = now.getFullYear();
      } catch (error) {
        console.log(error);
      }
    },
  },
  // HOOK
  created() {
    this.listLawyers();
    this.top10Lawyers();
    this.totalProcessesAndSolved();
  },
};
</script>

<style scoped>
div.home {
  margin-bottom: 5rem;
}
div#info img {
  margin-right: 0.2rem;
  width: 40px;
}
p#info {
  font-size: 0.7rem;
}
ul {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
  margin: 1rem;
  /* background-color: var(--background); */
}
p#quantity {
  display: flex;
  align-items: center;
  justify-content: center;
}
li {
  font-weight: bold;
  margin: 1rem;
  width: 35%;
}
h3 {
  font-size: 1rem;
  margin: 0.5rem;
}
div#search {
  margin: 1% auto 0 auto;
  box-sizing: border-box;
  border-radius: 20px;
  width: 65%;
  padding: 20px;
  background-color: var(--gray);
}
div#search select {
  outline: 0;
  font-size: 0.7rem;
  margin: 0.3rem;
  padding: 0.1rem;
  width: 90%;
  background-color: var(--bright);
  border-width: 0 0 3px;
  border-color: yellowgreen;
  color: var(--dark);
  border-radius: 10px;
}
div#button {
  display: flex;
  justify-content: space-evenly;
}
div#button button {
  font-size: 0.7rem;
  border-radius: 20px;
  outline: 0;
  margin-top: 0.5rem;
  box-shadow: 5px 5px 30px var(--button) inset;
  font-weight: bold;
}

div#order legend {
  margin-top: 0.3rem;
}
div#order select {
  outline: none;
  background-color: var(--bright);
  color: var(--dark);
}

@media (min-width: 700px) {
  div#info img {
    width: 50px;
  }
  p#quantity {
    font-size: 1.2rem;
  }
  p#info {
    font-size: 0.8rem;
  }
  li {
    width: 15%;
  }
  h3 {
    font-size: 1.25rem;
    margin: 0.7rem;
  }
  div#search {
    width: 85%;
    padding: 1rem;
  }
  div#search select {
    font-size: 0.9rem;
    padding: 0.1rem;
    width: 30%;
    display: inline-block;
  }
  div#button button {
    font-size: 0.9rem;
  }

  div#order select {
    font-size: 0.9rem;
    padding: 0.1rem;
  }
}

@media (min-width: 1000px) {
  div#info img {
    width: 60px;
  }
  p#info {
    font-size: 1rem;
  }
  p#quantity {
    font-size: 1.5rem;
  }
  h3 {
    font-size: 1.5rem;
  }
  div#search {
    width: 900px;
    padding: 40px;
  }
  div#search select {
    font-size: 1rem;
    padding: 0.2rem;
    width: 230px;
    margin: 1rem;
  }
  div#button button {
    font-size: 1rem;
    min-width: 100px;
  }

  div#order select {
    font-size: 1rem;
    padding: 0.2rem;
  }
}
</style>
