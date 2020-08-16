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
// Importamos sweetalert2
import Swal from "sweetalert2";
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
button#back {
  all: unset;
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

@media (min-width: 700px) {
  button#back {
    font-size: 1.25rem;
  }
  button#openProcess {
    font-size: 0.9rem;
  }
}

@media (min-width: 1000px) {
  button#back {
    font-size: 1.5rem;
  }
  button#openProcess {
    font-size: 1rem;
  }
}
</style>
