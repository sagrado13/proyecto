<template>
  <div v-if="isLoaded">
    <!-- Declaramos vue-headful -->
    <vue-headful title="Datos del abogado" />
    <!-- BOTÓN DE VOLVER ATRÁS -->
    <button id="back" @click="goBack()">
      <img src="../assets/deshacer.svg" />
    </button>
    <!-- BOTÓN DE ABRIR PROCESO CON EL ABOGADO SELECCIONADO -->
    <button id="openProcess">
      <router-link
        :to="{
          name: 'NewProcess',
          params: { id: dataLawyer.id, lawFirm: dataLawyer.lawFirm },
        }"
      >💼 Abrir proceso</router-link>
    </button>
    <!-- DATOS DEL ABOGADO SELECCIONADO -->
    <getlawyercomp :dataLawyer="dataLawyer" :specialities="specialities" />
  </div>
</template>

<script>
// Importamos axios
import axios from "axios";
// Importamos sweetalert2
import Swal from "sweetalert2";
// Importamos el componente GetLawyerComp
import getlawyercomp from "@/components/GetLawyerComp.vue";
// IMPORTAMOS FUNCIONES
import { getIdToken } from "../api/utils";
import { getIsAdmin, goBack } from "../api/utils";

export default {
  name: "GetLawyer",
  components: {
    getlawyercomp,
  },
  data() {
    return {
      dataLawyer: null,
      specialities: [],
    };
  },
  computed: {
    isLoaded() {
      return this.dataLawyer !== null;
    },
  },
  methods: {
    // FUNCIÓN PARA OBTENER DATOS DEL ABOGADO SELECCIONADO
    async GetLawyer() {
      try {
        const response = await axios.get(
          "http://localhost:3000/lawyers/" + this.$route.params.id + "/data"
        );
        this.dataLawyer = response.data.data.responseData;
        this.specialities = response.data.data.specialities;
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },
    // FUNCIÓN PARA VOLVER PARA ATRÁS
    goBack() {
      window.history.back();
    },
  },
  created() {
    this.GetLawyer();
  },
};
</script>

<style scoped>
button#openProcess {
  outline: none;
  font-size: 0.7rem;
  border-radius: 20px;
  padding: 1rem;
  box-shadow: 5px 5px 30px yellowgreen inset;
}

@media (min-width: 700px) {
  button#openProcess {
    font-size: 0.9rem;
  }
}

@media (min-width: 1000px) {
  button#openProcess {
    font-size: 1rem;
  }
}
</style>
