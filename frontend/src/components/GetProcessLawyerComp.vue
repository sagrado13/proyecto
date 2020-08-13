<template>
  <div>
    <img
      :class="{ hide: process.picture_user !== null }"
      src="../assets/profile.jpeg"
      alt="Foto de perfil por defecto"
    />
    <img
      :class="{ hide: process.picture_user === null }"
      :src="process.picture_user"
      alt="Foto usuario"
    />
    <p>
      <span>Cliente:</span>
      {{ process.name }} {{ process.surname }}
    </p>
    <p>
      <span>Ciudad:</span>
      {{ process.city_user }}
    </p>
    <p>
      <span>Email:</span>
      {{ process.email_user }}
    </p>
    <p>
      <span>Teléfono:</span>
      {{ process.phone_number_user }}
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
    <p :class="{ hide: process.rating === null }">
      <star-rating
        :rating="Number(process.rating)"
        :read-only="true"
        :star-size="20"
        :inline="true"
      ></star-rating>
    </p>
    <p :class="{ hide: process.opinion === null }">
      <span>Opinión:</span>
      {{ process.opinion }}
    </p>
    <p>
      <span>Fecha de la creación:</span>
      {{ format(new Date(process.update_date), "dd/MM/yyyy HH:mm") }}h
    </p>
    <p>
      <span>Última actualización:</span>
      {{ format(new Date(process.update_date), "dd/MM/yyyy HH:mm") }}h
    </p>
    <div id="buttons">
      <button
        :class="{ hide: process.status_process !== 'pendiente de una resolución' }"
        @click="sendProcessData()"
      >Proceso resuelto</button>

      <button :class="{ hide: process.status_budget !== null }">
        <router-link :to="{ name: 'NewBudget', params: { id: process.id} }">Añadir presupuesto</router-link>
      </button>
    </div>
  </div>
</template>

<script>
// Importamos date-fns
import { format } from "date-fns";
export default {
  name: "GetProcessLawyerComp",
  props: {
    process: Object,
  },
  data() {
    return {
      format,
    };
  },
  methods: {
    sendProcessData() {
      let processData = `resuelto`;
      this.$emit("data", processData);
    },
  },
};
</script>

<style scoped>
img {
  border-radius: 50%;
  width: 35%;
}
span {
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
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  border-radius: 20px;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  box-shadow: 5px 5px 30px white inset;
}
button:nth-child(1) {
  box-shadow: 5px 5px 30px yellowgreen inset;
}
</style>
