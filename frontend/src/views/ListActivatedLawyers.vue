<template>
  <div id="listActivated">
    <!-- Declaramos vue-headful -->
    <vue-headful title="Abogados activos" />

    <!-- BOTÓN DE VOLVER ATRÁS -->
    <button id="back" @click="goBack()">
      <img src="../assets/deshacer.svg" />
    </button>

    <!-- SPINNER -->
    <loaderspinner :is-loading="!isLoaded">
      <div @click="listActivatedLawyers">
        <!-- TOTAL ABOGADOS ACTIVOS -->
        <div id="info">
          <p id="quantity">
            <img src="../assets/home/totalLawyer.png" alt="Total abogados" />
            {{ totalLawyers }}
          </p>
          <p id="info">Abogados activos</p>
        </div>

        <!-- ORDENACIÓÓN -->
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

        <!-- LISTADO DE ABOGADOS ACTIVOS -->
        <listactivatedlawyerscomp :lawyers="lawyers" />
      </div>
    </loaderspinner>
  </div>
</template>

<script>
// Importamos axios
import axios from "axios";
// Importamos sweetalert2
import Swal from "sweetalert2";
// importamos el componente ListActivatedLawyersComp
import listactivatedlawyerscomp from "@/components/ListActivatedLawyersComp.vue";
export default {
  name: "ListActivatedLawyers",
  components: {
    listactivatedlawyerscomp,
  },
  data() {
    return {
      lawyers: [],
      totalLawyers: "",
      order: "",
      direction: "",
    };
  },
  computed: {
    isLoaded() {
      return this.lawyers.length > 0;
    },
  },
  methods: {
    // FUNCIÓN PARA LISTAR LOS ABOGADOS ACTIVOS
    async listActivatedLawyers() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.get(
          process.env.VUE_APP_BACK_URL + "list-activated-lawyers",
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
    // FUNCIÓN PARA VOLVER PARA ATRÁS
    goBack() {
      window.history.back();
    },
  },
  created() {
    this.listActivatedLawyers();
  },
};
</script>

<style scoped>
div#listActivated {
  margin-bottom: 5rem;
}
div#info {
  margin-bottom: 1rem;
  font-weight: bold;
}
div#info img {
  margin-right: 0.2rem;
  width: 40px;
}
p#info {
  font-size: 0.7rem;
}
p#quantity {
  display: flex;
  align-items: center;
  justify-content: center;
}
select {
  background-color: var(--bright);
  color: var(--dark);
  font-size: 0.7rem;
}
button#back {
  margin: 0;
  box-shadow: none;
  min-width: 0;
}
button#back img {
  width: 15px;
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
  select {
    font-size: 0.9rem;
  }
  button#back img {
    width: 20px;
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
  select {
    font-size: 1rem;
  }
  button#back img {
    width: 30px;
  }
}
</style>
