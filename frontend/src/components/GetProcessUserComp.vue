<template>
  <div>
    <img
      :class="{ hide: process.picture_lawyer !== null }"
      src="../assets/profile.jpeg"
      alt="Foto de perfil por defecto"
    />
    <img
      :class="{ hide: process.picture_lawyer === null}"
      :src="getPictureLawyers(process.picture_lawyer)"
      alt="Foto abogado"
    />
    <p>
      <span>Abogado:</span>
      {{ process.law_firm }}
    </p>
    <p>
      <span>Ciudad:</span>
      {{ process.city_lawyer }}
    </p>
    <p>
      <span>Email:</span>
      {{ process.email_lawyer }}
    </p>
    <p :class="{ hide: process.phone_number_lawyer === null}">
      <span>Teléfono:</span>
      {{ process.phone_number_lawyer }}
    </p>
    <p>
      <span>Estado del proceso:</span>
      {{ process.status_process }}
    </p>
    <p>
      <span>Mensaje del proceso:</span>
      {{ process.message_process }}
    </p>
    <p :class="{ hide: process.observations === null}">
      <span>Observaciones:</span>
      {{ process.observations }}
    </p>
    <p :class="{ hide: process.status_budget === null}">
      <span>Estado del presupuesto:</span>
      {{ process.status_budget }}
    </p>
    <p :class="{ hide: process.price === null}">
      <span>Precio:</span>
      {{ process.price }}€
    </p>
    <p :class="{ hide: process.rating === null}">
      <star-rating
        :rating="Number(process.rating)"
        :read-only="true"
        :star-size="20"
        :inline="true"
        :glow="2"
      ></star-rating>
    </p>
    <p :class="{ hide: process.opinion === null}">
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
        :class="{ hide: process.status_process === 'resuelto' }"
        @click="sendProcessData()"
      >Editar</button>
      <button @click="sendProcessDelete()">Borrar</button>
    </div>
  </div>
</template>

<script>
// Importamos date-fns
import { format } from "date-fns";
export default {
  name: "GetProcessUserComp",
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
      let processData = this.process;
      this.$emit("data", processData);
    },
    sendProcessDelete() {
      let processDelete = this.process;
      this.$emit("delete", processDelete);
    },
    // FUNCIÓN PARA OBTENER FOTO DE ABOGADO
    getPictureLawyers(picture) {
      if (picture !== null) {
        return process.env.VUE_APP_STATIC_LAWYERS + picture;
      }
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
div#buttons button:nth-child(2) {
  background: red;
}

@media (min-width: 700px) {
  img {
    width: 20%;
  }

  span {
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

@media (min-width: 1000px) {
  img {
    width: 10%;
  }
  p {
    font-size: 1rem;
  }
  button {
    font-size: 1rem;
  }
}
</style>
