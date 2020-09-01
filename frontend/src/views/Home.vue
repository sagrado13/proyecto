<template>
  <div class="home">
    <!-- Declaramos vue-headful -->
    <vue-headful title="Inicio" />
    <!-- SPINNER -->
    <loaderspinner :is-loading="!isLoaded">
      <div id="search">
        <p id="info">Abogados en la web: 👤 {{ totalLawyers }}</p>
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
        <button @click="searchLawyer()">Buscar</button>
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
        <p>Abogados encontrados: 👤 {{ totalLawyersFound }}</p>
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
// Importamos LoaderSpinner
import loaderspinner from "@/components/LoaderSpinner.vue";

export default {
  name: "Home",
  components: {
    listlawyerscomp,
    searchlawyerscomp,
    top5lawyerscomp,
    loaderspinner,
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
    };
  },
  computed: {
    isLoaded() {
      return this.lawyers.length > 0 || this.searchLawyers.length > 0;
    },
  },
  methods: {
    // FUNCIÓN PARA OBTENER LISTADO DE ABOGADOS
    async listLawyers() {
      try {
        const response = await axios.get("http://localhost:3000/lawyers/list");
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
          "http://localhost:3000/lawyers/search",
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
    // FUNCIÓN PARA OBTENER EL TOP10 DE ABOGADOS CON LAS MEJORES PUNTUACIONES
    async top10Lawyers() {
      try {
        const response = await axios.get("http://localhost:3000/lawyers/top10");
        this.topLawyers = response.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
  },
  // HOOK
  created() {
    this.listLawyers();
    this.top10Lawyers();
  },
};
</script>

<style scoped>
p#info {
  margin-top: 1rem;
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
div#search button {
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
  div#search button {
    font-size: 0.9rem;
  }

  div#order select {
    font-size: 0.9rem;
    padding: 0.1rem;
  }
  p {
    margin-top: 1rem;
  }
}

@media (min-width: 1000px) {
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
  div#search button {
    font-size: 1rem;
    min-width: 100px;
  }

  div#order select {
    font-size: 1rem;
    padding: 0.2rem;
  }
}
</style>
