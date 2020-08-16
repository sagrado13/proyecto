<template>
  <div class="home">
    <p id="info">Abogados en la web: 👤 {{ totalLawyers }}</p>
    <h3>Busca el abogado que necesitas</h3>
    <div id="search">
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

      <select v-model="city" name="city">
        <option value>Selecciona una localidad</option>
        <option v-for="province in provinces" :key="province.id" :value="province">{{ province }}</option>
      </select>

      <select v-model="urgency" name="urgency">
        <option value>Selecciona la urgencia</option>
        <option value="Alta">Alta</option>
        <option value="Media">Media</option>
        <option value="Baja">Baja</option>
      </select>
      <button @click="searchLawyer()">Buscar</button>
    </div>

    <div id="order" @click="searchLawyer()" v-show="!showListLawyers">
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
    <listlawyerscomp v-show="showListLawyers" :lawyers="lawyers" />
    <div>
      <p v-show="!showListLawyers">Abogados encontrados: 👤 {{ totalLawyersFound }}</p>
      <searchlawyerscomp :searchLawyers="searchLawyers" />
    </div>
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
export default {
  name: "Home",
  components: {
    listlawyerscomp,
    searchlawyerscomp,
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
        "Avila",
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
    };
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
        } else {
          Swal.fire({
            icon: "error",
            title: `${error.response.data.message}`,
          });
        }
      }
    },
  },
  // HOOK
  created() {
    this.listLawyers();
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
  margin: 0 auto;
  box-sizing: border-box;
  border-radius: 20px;
  width: 65%;
  padding: 5px;
  background-color: rgb(108, 109, 110);
  margin-bottom: 1.25rem;
}
div#search select {
  outline: 0;
  font-size: 0.7rem;
  margin: 0.3rem;
  padding: 0.1rem;
  width: 90%;
  background-color: black;
  border-width: 0 0 1px;
  border-color: yellowgreen;
  color: white;
  border-radius: 20px;
}
div#search button {
  font-size: 0.7rem;
  border-radius: 20px;
  outline: 0;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  margin-top: 0.5rem;
  box-shadow: 5px 5px 30px white inset;
}

div#order legend {
  margin-top: 0.3rem;
}
div#order select {
  outline: none;
  background-color: black;
  color: white;
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
  p#info {
    margin-top: 2rem;
  }
  div#search {
    width: 900px;
  }
  div#search select {
    font-size: 1rem;
    padding: 0.2rem;
    width: 230px;
    margin-left: 2rem;
  }
  div#search button {
    font-size: 1rem;
  }

  div#order select {
    font-size: 1rem;
    padding: 0.2rem;
  }
}
</style>
