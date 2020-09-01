<template>
  <div>
    <!-- Declaramos vue-headful -->
    <vue-headful title="Votos del abogado" />

    <!-- BOTÓN DE VOLVER ATRÁS -->
    <button id="back" @click="goBack()">
      <img src="../assets/deshacer.svg" />
    </button>

    <!-- LISTADO DE PUNTUCIONES DEL ABOGADO SELECCIONADO -->
    <listratingscomp :lawyer="lawyer" :ratings="ratings" />
  </div>
</template>

<script>
// Importamos axios
import axios from "axios";
// Importamos sweetalert2
import Swal from "sweetalert2";
// Importamos el componente ListRatingsComp
import listratingscomp from "@/components/ListRatingsComp.vue";
export default {
  name: "ListRating",
  components: {
    listratingscomp,
  },
  data() {
    return {
      lawyer: {},
      ratings: [],
    };
  },
  methods: {
    // FUNCIÓN PARA VOLVER PARA ATRÁS
    goBack() {
      window.history.back();
    },
    // FUNCIÓN PARA OBTENER LISTADO DE PUNTUACIONES DEL ABOGADO SELECCIONADO
    async listRatings() {
      try {
        const response = await axios.get(
          "http://localhost:3000/lawyers/" +
            this.$route.params.id +
            "/list-rating"
        );
        for (let i = 0; i < response.data.data.ratings.length; i++) {
          if (response.data.data.ratings[i].login_user === null) {
            response.data.data.ratings[i].login_user = "Anónimo";
          }
        }
        this.lawyer = response.data.data;
        this.ratings = response.data.data.ratings;
      } catch (error) {
        console.log(error.response.data.message);
        window.history.back();
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },
  },
  created() {
    this.listRatings();
  },
};
</script>

<style scoped>
@media (min-width: 700px) {
  button {
    font-size: 1.25rem;
  }
}

@media (min-width: 1000px) {
  button {
    font-size: 1.5rem;
  }
}
</style>