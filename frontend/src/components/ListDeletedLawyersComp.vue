<template>
  <div>
    <input
      type="search"
      v-model="search"
      placeholder="Buscar por bufete, teléfono, login o email"
      size="35"
    />
    <ul>
      <li v-for="(lawyer, index) in filtered" :key="lawyer.id">
        <img
          :class="{ hide: lawyer.picture_lawyer !== null }"
          src="../assets/profile.jpeg"
          alt="Foto de perfil por defecto"
        />
        <img
          :class="{ hide: lawyer.picture_lawyer === null }"
          :src="getPictureLawyers(lawyer.picture_lawyer)"
          alt="Foto del abogado"
        />
        <p>
          <span>Abogado:</span>
          {{ lawyer.law_firm }}
        </p>
        <p>
          <span>Dirección:</span>
          {{ lawyer.street }} {{ lawyer.zip }}
        </p>
        <p>
          <span>Ciudad:</span>
          {{ lawyer.city_lawyer }}
        </p>
        <p :class="{ hide: lawyer.phone_number_lawyer === null }">
          <span>Teléfono:</span>
          {{ lawyer.phone_number_lawyer }}
        </p>
        <p>
          <span>Login:</span>
          {{ lawyer.login_lawyer }}
        </p>
        <p>
          <span>Email:</span>
          {{ lawyer.email_lawyer }}
        </p>
        <p :class="{ hide: lawyer.low_reason === null }">
          <span>Motivo de la baja:</span>
          {{ lawyer.low_reason }}
        </p>
        <p :class="{ hide: lawyer.registration_code === null }">
          <span>Código de registro:</span>
          {{ lawyer.registration_code }}
        </p>
        <p>
          <span>Fecha de registro:</span>
          {{ format(new Date(lawyer.update_date), "dd/MM/yyyy") }}
        </p>
        <p>
          <span>Fecha de la última conexión:</span>
          {{ format(new Date(lawyer.update_date), "dd/MM/yyyy HH:mm") }}h
        </p>
        <button @click="sendIdLawyer(index)">Reactivar</button>
      </li>
    </ul>
  </div>
</template>

<script>
// Importamos date-fns
import { format } from "date-fns";
export default {
  name: "ListDeletedLawyersComp",
  props: {
    lawyers: Array,
  },
  data() {
    return {
      format,
      search: "",
    };
  },
  computed: {
    /* FILTRO POR TELÉFONO, LOGIN Y EMAIL. CAMBIA CUALQUIER MAYÚSCULA A MINÚSCULA,
    Y ELIMINA CUALQUIER SIGNO DIACRÍTICO */
    filtered() {
      if (!this.search) {
        return this.lawyers;
      }
      return this.lawyers.filter(
        (lawyer) =>
          lawyer.law_firm
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(
              this.search
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
            ) ||
          lawyer.login_lawyer
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(
              this.search
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
            ) ||
          lawyer.phone_number_lawyer
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(
              this.search
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
            ) ||
          lawyer.email_lawyer
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(
              this.search
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
            )
      );
    },
  },
  methods: {
    // FUNCIÓN PARA OBTENER LA IMAGEN
    getPictureLawyers(picture) {
      if (picture !== null) {
        return process.env.VUE_APP_STATIC_LAWYERS + picture;
      }
    },
    // FUNCIÓN PARA ENVIAR EL ID DEL ABOGADO SELECCIONADO
    sendIdLawyer(index) {
      let idLawyer = this.lawyers[index].id;
      this.$emit("id", idLawyer);
    },
  },
};
</script>

<style scoped>
input {
  outline: 0;
  border-width: 0 0 1px;
  border-color: yellowgreen;
  font-size: 0.7rem;
  text-align: center;
  background: rgb(22, 22, 22);
  color: white;
  padding: 0.1rem;
  margin: 1rem;
}
img {
  border-radius: 50%;
  width: 35%;
}
ul {
  margin-bottom: 2rem;
}
ul li {
  list-style: none;
  margin: 1rem;
  padding: 1rem;
  border: 1px solid white;
}
ul li p {
  margin-top: 0.5rem;
  font-size: 0.8rem;
}
ul li p span {
  font-weight: bold;
  text-decoration: underline;
  display: block;
}
button {
  outline: none;
  font-size: 0.7rem;
  border-radius: 20px;
  padding: 0.3rem;
  margin-top: 1rem;
  box-shadow: 5px 5px 30px white inset;
}

@media (min-width: 700px) {
  input {
    font-size: 0.9rem;
    width: 280px;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  ul li {
    max-width: 190px;
  }
  ul li p {
    margin-top: 0.6rem;
    font-size: 0.9rem;
    word-break: break-word;
  }
  button {
    font-size: 0.8rem;
    word-break: normal;
  }
}

@media (min-width: 1000px) {
  input {
    font-size: 1rem;
    width: 320px;
  }
  ul {
    display: unset;
  }
  ul li {
    font-size: 1rem;
    max-width: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  img {
    width: 8%;
  }
  ul li span {
    word-break: normal;
  }
  ul li p {
    font-size: 1rem;
    margin-left: 0.5rem;
    align-self: center;
  }

  button {
    margin-left: 1rem;
    font-size: 0.9rem;
    align-self: center;
  }
}
</style>
