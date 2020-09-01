<template>
  <div v-if="isLoaded">
    <img
      :class="{ hide: process.picture_lawyer !== null }"
      src="../assets/profile.jpeg"
      alt="Foto de perfil por defecto"
    />
    <img
      :class="{ hide: process.picture_lawyer === null }"
      :src="getPictureLawyers(process.picture_lawyer)"
      alt="Foto abogado"
    />
    <p>
      <span>Abogado:</span>
      <router-link
        class="link"
        :to="{ name: 'GetLawyer', params: { id: process.id_lawyer } }"
      >{{ process.law_firm }}</router-link>
    </p>
    <p>
      <span>Localidad:</span>
      {{ process.city_lawyer }}
    </p>
    <p>
      <span>Email:</span>
      {{ process.email_lawyer }}
    </p>
    <p :class="{ hide: process.phone_number_lawyer === null }">
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
        :glow="2"
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
        :class="{ hide: process.status_process === 'resuelto' }"
        @click="sendProcessData()"
      >Editar</button>
      <button
        id="delete"
        v-if="
          process.status_process === 'pendiente de presupuesto' ||
            process.status_process === 'resuelto' ||
            isAdmin === true
        "
        @click="sendProcessDelete()"
      >Borrar</button>
    </div>
  </div>
</template>

<script>
// Importamos date-fns
import { format, formatDistanceToNow } from "date-fns";
import es from "date-fns/locale/es";

//IMPORTAMOS FUNCIÓN
import { checkIsAdmin } from "../api/utils.js";
export default {
  name: "GetProcessUserComp",
  props: {
    process: Object,
  },
  computed: {
    // PARA RENDERIZAR SI PROCESS NO ES NULL
    isLoaded() {
      return this.process !== null;
    },
    // PARA SABER SI ES ADMIN
    isAdmin() {
      return checkIsAdmin();
    },
  },
  methods: {
    // FUNCIÓN QUE EMITE UN EVENTO CON LOS DATOS DEL PROCESO PARA EDITAR
    sendProcessData() {
      let processData = this.process;
      this.$emit("data", processData);
    },
    // FUNCIÓN QUE EMITE UN EVENTO CON LOS DATOS DEL PROCESO PARA ELIMINAR
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
div#buttons button#delete {
  box-shadow: 5px 5px 30px red inset;
}
.vue-star-rating {
  margin-top: 1rem;
}
.link {
  text-decoration: none;
  color: goldenrod;
}
.link:visited {
  color: goldenrod;
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
