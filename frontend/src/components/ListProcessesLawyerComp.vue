<template>
  <div>
    <ul>
      <li v-for="(process, index) in processes" :key="process.id">
        <h3>
          <span>Proceso Nº {{ process.id }}</span>
        </h3>
        <p :class="{ hide: process.rating === null }">
          <star-rating
            :rating="Number(process.rating)"
            :read-only="true"
            :star-size="20"
            :inline="true"
            :glow="2"
          ></star-rating>
        </p>
        <p>
          <span>Cliente:</span>
          {{ process.name }} {{ process.surname }}
        </p>
        <p>
          <span>Ciudad:</span>
          {{ process.city_user }}
        </p>
        <p>
          <span>Estado del proceso:</span>
          {{ process.status_process }}
        </p>
        <p>
          <span>Mensaje del proceso:</span>
          {{ process.message_process }}
        </p>
        <p :class="{ hide: process.observations === null }">
          <span>Observaciones:</span>
          {{ process.observations }}
        </p>
        <p :class="{ hide: process.status_budget === null }">
          <span>Estado del presupuesto:</span>
          {{ process.status_budget }}
        </p>
        <p :class="{ hide: process.price === null }">
          <span>Precio:</span>
          {{ process.price }}€
        </p>
        <p>
          <span>Fecha de la creación:</span>
          {{ format(new Date(process.creation_date), "dd/MM/yyyy HH:mm") }}h
        </p>
        <p>
          <span>Última actualización:</span>
          {{ format(new Date(process.update_date), "dd/MM/yyyy HH:mm") }}h
        </p>
        <div id="buttons">
          <button @click="sendIdProcess(index)">Ver más</button>
          <button :class="{ hide: process.status_budget === null }">
            <router-link
              :to="{ name: 'GetBudgetLawyer', params: { id: process.id } }"
            >Ver presupuesto</router-link>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// Importamos date-fns
import { format } from "date-fns";
export default {
  name: "ListProcessesLawyerComp",
  props: {
    processes: Array,
  },
  data() {
    return {
      format,
    };
  },
  methods: {
    sendIdProcess(index) {
      let idProcess = this.processes[index].id;
      this.$emit("id", idProcess);
    },
  },
};
</script>

<style scoped>
ul li {
  list-style: none;
}
ul li {
  list-style: none;
  border: 1px solid white;
  margin: 0.5rem;
  padding: 0.3rem;
}
ul li h3 {
  text-decoration: underline;
  margin-bottom: 0.5rem;
}
ul li span {
  font-weight: bold;
  text-decoration: underline;
  display: flex;
  justify-content: space-around;
  margin-top: 0.5rem;
}
p {
  font-size: 0.8rem;
}
div#buttons {
  display: flex;
  justify-content: space-between;
}
button {
  outline: none;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  border-radius: 20px;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  box-shadow: 5px 5px 30px white inset;
}
</style>