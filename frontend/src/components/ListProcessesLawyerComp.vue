<template>
  <div>
    <!-- DATOS DEL LOS PROCESOS DEL ABOGADO -->
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
          {{ formatDate(process.creation_date) }}h
        </p>
        <p>
          <span>Última actualización:</span>
          Hace
          {{ formatDistanceDate(process.update_date) }}
        </p>

        <!-- BOTONES PARA VER MÁS Y VER PRESUPUESTO (VER PRESUPUESTO APARECE SI EXISTE PRESUPUESTO)-->
        <div id="buttons">
          <button @click="sendIdProcess(index)">Ver más</button>
          <router-link
            :class="{ hide: process.status_budget === null }"
            tag="button"
            :to="{
                name: 'GetBudgetLawyer',
                params: { id: process.id, idLawyer: process.id_lawyer },
              }"
          >Ver presupuesto</router-link>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// Importamos date-fns
import { format, formatDistanceToNow } from "date-fns";
import es from "date-fns/locale/es";

export default {
  name: "ListProcessesLawyerComp",
  props: {
    processes: Array,
  },
  methods: {
    // FUNCIÓN QUE EMITE UN EVENTO EL CUAL ENVÍA EL ID DEL PROCESO SELECCIONADO PARA VER TODA LA INFORMACIÓN
    sendIdProcess(index) {
      let idProcess = this.processes[index].id;
      this.$emit("id", idProcess);
    },
    //FUNCIÓN PARA FORMATEAR FECHA
    formatDate(date) {
      return format(new Date(date), "dd/MM/yyyy HH:mm");
    },
    //FUNCIÓN PARA CALCULAR EL TIEMPO DESDE LA FECHA
    formatDistanceDate(date) {
      return formatDistanceToNow(new Date(date), {
        includeSeconds: true,
        locale: es,
      });
    },
  },
};
</script>

<style scoped>
ul li {
  list-style: none;
  background-color: var(--bright);
}
ul li {
  list-style: none;
  border: 1px solid var(--dark);
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
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
  box-shadow: 5px 5px 30px var(--button) inset;
  font-weight: bold;
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
  }
}

@media (min-width: 1000px) {
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  ul li {
    width: 600px;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  p {
    font-size: 1rem;
  }
  button {
    font-size: 1rem;
  }
}
</style>
