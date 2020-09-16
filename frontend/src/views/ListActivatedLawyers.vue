<template>
  <div id="listActivated">
    <!-- Declaramos vue-headful -->
    <vue-headful title="Abogados activos" />

    <!-- BOTÓN DE VOLVER ATRÁS -->
    <button id="back" @click="goBack()">
      <img src="../assets/deshacer.svg" />
    </button>

    <div v-if="!showLowLawyer" @click="listActivatedLawyers">
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
      <listactivatedlawyerscomp @data="showLowLawyers" :lawyers="lawyers" />
    </div>

    <!-- FORMULARIO PARA DAR DE BAJA -->
    <div id="deleteLawyer" v-if="showLowLawyer">
      <p>Dar de baja a {{ lowLawyer }}</p>
      <textarea
        v-model="lowReason"
        placeholder="Motivo por el que das de baja a este abogado"
        name="lowReason"
        cols="30"
        rows="10"
      ></textarea>
      <br />
      <button @click="showLowLawyer = !showLowLawyer">Cancelar</button>
      <button id="delete" @click="deleteLawyer()">Dar de baja</button>
    </div>
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
      lowReason: "",
      showLowLawyer: false,
      lowLawyer: "",
      idLawyer: "",
    };
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
    // FUNCIÓN PARA MOSTRAR FORMULARIO PARA DAR DE BAJA
    showLowLawyers(dataLawyer) {
      this.showLowLawyer = true;
      this.lowLawyer = dataLawyer.law_firm;
      this.idLawyer = dataLawyer.id;
    },
    // FUNCIÓN PARA DAR DE BAJA UN ABOGADO
    async deleteLawyer() {
      const result = await Swal.fire({
        title: `Estas seguro de que quieres dar de baja a ${this.lowLawyer}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, estoy seguro!",
        cancelButtonText: "No, cancelar!",
        reverseButtons: true,
      });
      if (result.value) {
        try {
          const response = await axios.put(
            process.env.VUE_APP_BACK_URL +
              "lawyers/" +
              this.idLawyer +
              "/delete",
            {
              lowReason: this.lowReason,
            }
          );
          this.showLowLawyer = false;
          Swal.fire({
            icon: "success",
            title: "Abogado borrado correctamente",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: `${error.response.data.message}`,
          });
        }
      } else {
        Swal.fire({
          title: "Baja cancelada",
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
div#deleteLawyer {
  background-color: var(--background);
  border-radius: 30px;
  margin: 1rem;
  padding: 1rem;
}
div#deleteLawyer p {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
textarea {
  outline: none;
  font-size: 0.8rem;
  width: 90%;
}
button {
  outline: none;
  margin: 1rem;
  font-size: 0.5rem;
  border-radius: 20px;
  min-width: 55px;
  box-shadow: 5px 5px 30px var(--button) inset;
}
button#delete {
  box-shadow: 5px 5px 30px red inset;
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
  div#deleteLawyer {
    width: 70%;
    margin: 2% auto;
  }
  select {
    font-size: 0.9rem;
  }
  button {
    font-size: 0.8rem;
    min-width: 90px;
  }
  textarea {
    min-width: 300px;
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
  div#deleteLawyer {
    width: 50%;
  }
  div#deleteLawyer p {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  button {
    font-size: 0.9rem;
    min-width: 100px;
  }
  textarea {
    min-width: 450px;
    height: 350px;
    font-size: 1rem;
  }
  button#back img {
    width: 30px;
  }
}
</style>
