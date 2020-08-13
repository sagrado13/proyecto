<template>
  <div>
    <ul>
      <li v-for="(process, index) in processes" :key="process.id">
        <h3>
          <span>Proceso Nº {{ process.id }}</span>
        </h3>
        <p>
          <star-rating
            :rating="Number(process.rating)"
            :read-only="true"
            :star-size="20"
            :inline="true"
            :glow="2"
          ></star-rating>
        </p>
        <p>
          <span>Abogado:</span>
          {{ process.law_firm }}
        </p>
        <p>
          <span>Ciudad del abogado:</span>
          {{ process.city_lawyer }}
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
            <router-link :to="{ name: 'GetBudgetUser', params: { id: process.id } }">Ver presupuesto</router-link>
          </button>
          <button
            :class="{ hide: process.status_process !== 'resuelto' }"
            @click="sendProcessData(index)"
          >Votar</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// Importamos date-fns
import { format } from "date-fns";
export default {
  name: "ListProcessesUserComp",
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
      this.$emit("data", idProcess);
    },
    sendProcessData(index) {
      let processData = this.processes[index];
      this.$emit("id", processData);
    },
  },
};
</script>

<style scoped>
ul {
  margin-bottom: 2rem;
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
  justify-content: space-evenly;
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

@media (min-width: 700px) {
  ul li h3 {
    font-size: 1.5rem;
  }
  ul li span {
    display: inline-block;
    margin-top: 0.7rem;
  }
  p {
    font-size: 0.9rem;
  }
  div#buttons {
    justify-content: space-between;
  }
  button {
    font-size: 0.9rem;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
  }
}
</style>
