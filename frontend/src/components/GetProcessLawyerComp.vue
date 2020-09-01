<template>
  <div v-if="isLoaded">
    <!-- DATOS DE UN PROCESO DETERMINADO DEL ABOGADO -->
    <img
      :class="{ hide: process.picture_user !== null }"
      src="../assets/profile.jpeg"
      alt="Foto de perfil por defecto"
    />
    <img
      :class="{ hide: process.picture_user === null }"
      :src="getPictureUsers(process.picture_user)"
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
      {{ formatDate(process.creation_date) }}h
    </p>
    <p>
      <span>Última actualización:</span>
      Hace
      {{ formatDistanceDate(process.update_date) }}
    </p>
    <div id="buttons">
      <button
        :class="{
          hide: process.status_process !== 'pendiente de una resolución',
        }"
        @click="sendProcessData()"
      >Proceso resuelto</button>
      <button :class="{ hide: process.status_budget !== null }">
        <router-link :to="{ name: 'NewBudget', params: { id: process.id } }">Añadir presupuesto</router-link>
      </button>
    </div>
  </div>
</template>

<script>
// Importamos date-fns
import { format, formatDistanceToNow } from "date-fns";
import es from "date-fns/locale/es";

export default {
  name: "GetProcessLawyerComp",
  props: {
    process: Object,
  },
  computed: {
    isLoaded() {
      return this.process !== null;
    },
  },
  methods: {
    // FUNCIÓN QUE EMITE UN EVENTO CON EL DATO 'RESUELTO' PARA CAMBIAR A ESE ESTADO EL PROCESO
    sendProcessData() {
      let processData = `resuelto`;
      this.$emit("data", processData);
    },
    // FUNCIÓN PARA OBTENER FOTO DE USUARIO
    getPictureUsers(picture) {
      if (picture !== null) {
        return process.env.VUE_APP_STATIC_USERS + picture;
      }
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
img {
  border-radius: 50%;
  width: 100px;
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
p:last-of-type {
  margin-bottom: 1rem;
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
  box-shadow: 5px 5px 30px var(--button) inset;
}
button:nth-child(1) {
  box-shadow: 5px 5px 30px yellowgreen inset;
}
.vue-star-rating {
  margin-top: 1rem;
}

@media (min-width: 700px) {
  img {
    width: 150px;
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
  }
}

@media (min-width: 1000px) {
  p {
    font-size: 1rem;
  }
  button {
    font-size: 1rem;
  }
}
</style>
