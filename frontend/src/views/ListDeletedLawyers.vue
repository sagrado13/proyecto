<template>
  <div>
    <!-- Declaramos vue-headful -->
    <vue-headful title="Abogados dados de baja" />

    <!-- BOTÓN DE VOLVER ATRÁS -->
    <button id="back" @click="goBack()">
      <img src="../assets/deshacer.svg" />
    </button>
    <h4>Abogados dados de baja: 👤 {{ totalLawyers }}</h4>

    <!-- ORDENACIÓN -->
    <div @click="listDeletedLawyers">
      <legend>Ordenar</legend>
      <select v-model="order" name="order">
        <option value>Bufete</option>
        <option value="email">Email</option>
        <option value="city">Localidad</option>
        <option value="login">Login</option>
        <option value="updateDate">Última conexión</option>
      </select>
      <select v-model="direction" name="direction">
        <option value>Ascendente</option>
        <option value="desc">Descendente</option>
      </select>
    </div>

    <!-- LISTADO DE ABOGADOS DADOS DE BAJA -->
    <listdeletedlawyerscomp @data="reactivateLawyer" :lawyers="lawyers" />
  </div>
</template>

<script>
// Importamos axios
import axios from "axios";
// Importamos sweetalert2
import Swal from "sweetalert2";
// importamos el componente ListDeletedLawyersComp
import listdeletedlawyerscomp from "@/components/ListDeletedLawyersComp.vue";
export default {
  name: "ListDeletedLawyers",
  components: {
    listdeletedlawyerscomp,
  },
  data() {
    return {
      lawyers: [],
      totalLawyers: "",
      order: "",
      direction: "",
    };
  },
  methods: {
    // FUNCIÓN PARA LISTAR LOS ABOGADOS DADOS DE BAJA
    async listDeletedLawyers() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.get(
          "http://localhost:3000/list-deleted-lawyers",
          {
            params: {
              order: this.order,
              direction: this.direction,
            },
          }
        );
        this.lawyers = response.data.lawyers;
        this.totalLawyers = response.data.data[0].total_lawyers;
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
        window.history.back();
      }
    },
    // FUNCIÓN PARA REACTIVAR LA CUENTA DE UN ABOAGADO
    async reactivateLawyer(dataLawyer) {
      const result = await Swal.fire({
        title: `Estas seguro de que quieres reactivar la cuenta de ${dataLawyer.law_firm}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, estoy seguro!",
        cancelButtonText: "No, cancelar!",
        reverseButtons: true,
      });
      if (result.value) {
        try {
          const response = await axios.get(
            "http://localhost:3000/reactivate-lawyer/" + dataLawyer.id
          );
          Swal.fire({
            title: `${response.data.message}`,
            icon: "success",
            confirmButtonText: "OK",
          });
          this.listDeletedLawyers();
        } catch (error) {
          console.log(error.response);
          Swal.fire({
            icon: "error",
            title: `${error.response.data.message}`,
          });
        }
      } else {
        Swal.fire({
          title: "Reactivación cancelada",
          icon: "error",
        });
      }
    },
    // FUNCIÓN PARA VOLVER PARA ATRÁS
    goBack() {
      window.history.back();
    },
  },
  created() {
    this.listDeletedLawyers();
  },
};
</script>

<style scoped>
h4 {
  margin: 1rem;
}
select {
  background-color: var(--bright);
  color: var(--dark);
  font-size: 0.7rem;
}

@media (min-width: 700px) {
  select {
    font-size: 0.9rem;
  }
}

@media (min-width: 700px) {
  h4 {
    margin: 1.5rem;
  }
  select {
    font-size: 1rem;
  }
}
</style>