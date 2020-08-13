<template>
  <div>
    <button id="back" @click="goBack()">🔙</button>
    <getlawyercomp :dataLawyer="dataLawyer" :specialities="specialities" />
    <button id="openProcess">
      <router-link :to="{ name: 'NewProcess', params: { id: dataLawyer.id } }">💼 Abrir proceso</router-link>
    </button>
  </div>
</template>

<script>
// Importamos axios
import axios from "axios";
// Importamos el componente GetLawyerComp
import getlawyercomp from "@/components/GetLawyerComp.vue";
// IMPORTAMOS FUNCIONES
import { getIdToken } from "../api/utils";
import { getIsAdmin } from "../api/utils";

export default {
  name: "GetLawyer",
  components: {
    getlawyercomp,
  },
  data() {
    return {
      dataLawyer: {},
      specialities: [],
      rol: "",
    };
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
        this.rol = getIsAdmin();
      } catch (error) {
        console.log(error.response.data.message);
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
button#back {
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
  padding-left: 0.1rem;
  padding-right: 0.1rem;
  box-shadow: 5px 5px 30px white inset;
  display: flex;
}
button#openProcess {
  margin-bottom: 3rem;
  font-size: 0.7rem;
  border-radius: 20px;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  box-shadow: 5px 5px 30px white inset;
}
</style>
