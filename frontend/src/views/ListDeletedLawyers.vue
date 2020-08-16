<template>
  <div>
    <h4>Abogados dados de baja: 👤 {{ totalLawyers }}</h4>
    <div @click="listDeletedLawyers">
      <legend>Ordenar</legend>
      <select v-model="order" name="order">
        <option value>Bufete</option>
        <option value="email">Email</option>
        <option value="city">Ciudad</option>
        <option value="login">Login</option>
        <option value="updateDate">Última conexión</option>
      </select>
      <select v-model="direction" name="direction">
        <option value>Ascendente</option>
        <option value="desc">Descendente</option>
      </select>
    </div>
    <listdeletedlawyerscomp v-on:id="reactivateLawyer" :lawyers="lawyers" />
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
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get("http://localhost:3000/list-lawyers", {
          params: {
            order: this.order,
            direction: this.direction,
          },
        });
        this.lawyers = response.data.lawyers;
        this.totalLawyers = response.data.data[0].total_lawyers;
      } catch (error) {
        console.log(error);
      }
    },
    // FUNCIÓN PARA REACTIVAR LA CUENTA DE UN ABOAGADO
    async reactivateLawyer(idLawyer) {
      try {
        const response = await axios.get(
          "http://localhost:3000/reactivate-lawyer/" + idLawyer
        );
        Swal.fire({
          title: `${response.data.message}`,
          icon: "success",
          confirmButtonText: "OK",
        });
        location.reload();
      } catch (error) {
        console.log(error.response);
      }
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
  background-color: black;
  color: white;
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