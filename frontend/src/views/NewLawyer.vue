<template>
  <div>
    <!-- Declaramos vue-headful -->
    <vue-headful title="Regístrate abogado" />

    <!-- BOTÓN DE VOLVER ATRÁS -->
    <button id="back" @click="goBack()">
      <img src="../assets/deshacer.svg" />
    </button>
    <h3>Regístrate para ser abogado</h3>

    <!-- FORMULARIO PARA REGISTRAR NUEVO ABOGADO -->
    <div id="register">
      <form action>
        <label>Nombre del bufete*</label>
        <input type="text" v-model="lawFirm" placeholder="Nombre del bufete" />
        <label>Dirección*</label>
        <input type="text" v-model="street" placeholder="Dirección" />
        <label>Código postal*</label>
        <input type="text" v-model="zip" placeholder="Código postal" />
        <label>Localidad*</label>
        <select v-model="city" name="city">
          <option value>Selecciona la localidad</option>
          <option v-for="province in provinces" :key="province.id" :value="province">{{ province }}</option>
        </select>
        <label>Teléfono*</label>
        <input type="tel" required v-model="phoneNumber" placeholder="Teléfono" />
        <label>Usuario*</label>
        <input type="text" v-model="login" placeholder="Usuario" />
        <label>Email*</label>
        <input type="email" v-model="emailLawyer" placeholder="Email" />
        <label>Contraseña*</label>
        <input
          :class=" { error: showMsg === true}"
          type="password"
          v-model="password"
          placeholder="Contraseña"
        />
        <small class="errorMsg" v-if="showMsg">*No coincide la contraseña*</small>
        <label>Repetir contraseña*</label>
        <input
          :class=" { error: showMsg === true}"
          type="password"
          v-model="password1"
          placeholder="Repite la contraseña"
        />
        <small class="errorMsg" v-if="showMsg">*No coincide la contraseña*</small>
        <legend>Urgencia tratando los casos</legend>
        <select v-model="urgency" name="urgency">
          <option value>Urgencia tratando los casos</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
        <legend>Descripción</legend>
        <input type="text" placeholder="Descripción" v-model="description" />
        <input id="upload" type="file" @change="processFile" ref="fileInput" />
        <button id="uploadPicture" @click="$refs.fileInput.click()">Cargar imagen</button>
        <progress max="100" :value.prop="uploadProgress"></progress>
      </form>
    </div>
    <button id="register" @click="addNewLawyers">Registrarse</button>
  </div>
</template>

<script>
// Importamos axios
import axios from "axios";
// Importamos sweetalert2
import Swal from "sweetalert2";

export default {
  name: "NewLawyer",
  data() {
    return {
      lawFirm: "",
      street: "",
      zip: "",
      city: "",
      phoneNumber: "",
      login: "",
      emailLawyer: "",
      password: "",
      password1: "",
      urgency: null,
      description: null,
      avatar: null,
      uploadProgress: 0,
      showMsg: false,
      provinces: [
        "A Coruña",
        "Álava",
        "Albacete",
        "Alicante",
        "Almería",
        "Asturias",
        "Ávila",
        "Badajoz",
        "Barcelona",
        "Burgos",
        "Cáceres",
        "Cádiz",
        "Cantabria",
        "Castellón",
        "Ciudad Real",
        "Córdoba",
        "Cuenca",
        "Gerona",
        "Granada",
        "Guadalajara",
        "Guipúzcoa",
        "Huelva",
        "Huesca",
        "Islas Baleares",
        "Jaén",
        "Las Palmas",
        "La Rioja",
        "León",
        "Lérida",
        "Lugo",
        "Madrid",
        "Málaga",
        "Murcia",
        "Navarra",
        "Orense",
        "Palencia",
        "Pontevedra",
        "Salamanca",
        "Santa Cruz de Tenerife",
        "Segovia",
        "Sevilla",
        "Soria",
        "Tarragona",
        "Teruel",
        "Toledo",
        "Valencia",
        "Valladolid",
        "Vizcaya",
        "Zamora",
        "Zaragoza",
      ],
    };
  },
  methods: {
    // FUNCIÓN PARA PROCESAR LA IMAGEN
    processFile(event) {
      this.avatar = event.target.files[0];
    },
    // FUNCIÓN PARA REGISTRAR ABOAGADO
    async addNewLawyers() {
      if (this.password !== this.password1) {
        return (this.showMsg = true);
      }
      try {
        let fd = new FormData();
        fd.append("lawFirm", this.lawFirm);
        fd.append("street", this.street);
        fd.append("zip", this.zip);
        fd.append("city", this.city);
        fd.append("phoneNumber", this.phoneNumber.replace(/[\-\.\  ]/g, ""));
        fd.append("login", this.login);
        fd.append("emailLawyer", this.emailLawyer);
        fd.append("password", this.password);
        if (this.urgency !== null) {
          fd.append("urgency", this.urgency);
        }
        if (this.description !== null) {
          fd.append("description", this.description);
        }
        if (this.avatar !== null) {
          fd.append("avatar", this.avatar);
        }
        const response = await axios.post("http://localhost:3000/lawyers", fd, {
          onUploadProgress: (uploadEvent) => {
            this.uploadProgress = Math.round(
              (uploadEvent.loaded / uploadEvent.total) * 100
            );
          },
        });
        this.$router.push("/");
        Swal.fire({
          title: "Abogado añadido correctamente",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },
    // FUNCIÓN PARA VOLVER PARA ATRÁS
    goBack() {
      window.history.back();
    },
  },
};
</script>

<style scoped>
.error {
  background-color: rgba(255, 0, 0, 0.336);
}
.error:hover {
  background-color: white;
}
h3 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}
div#register {
  margin: 0 auto;
  box-sizing: border-box;
  border-radius: 20px;
  width: 80%;
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: var(--background);
}
form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
label {
  font-size: 0.8rem;
  margin-top: 1rem;
}
input {
  outline: 0;
  border-width: 0 0 2px;
  border-color: yellowgreen;
  border-radius: 10px;
  font-size: 0.7rem;
  text-align: center;
  background: var(--bright);
  color: var(--dark);
  padding: 0.1rem;
}
select {
  outline: 0;
  font-size: 0.7rem;
  width: 150px;
  background-color: var(--bright);
  color: var(--dark);
  border-width: 0 0 2px;
  border-color: yellowgreen;
  border-radius: 10px;
  padding: 0.1rem;
  text-align-last: center;
}
input#upload {
  display: none;
}
legend {
  margin-top: 1rem;
  font-size: 0.7rem;
}
button#back {
  box-shadow: none;
}
button {
  outline: none;
  font-size: 0.7rem;
  border-radius: 20px;
  box-shadow: 5px 5px 30px var(--button) inset;
}
button#uploadPicture {
  margin-top: 0.5rem;
  font-size: 0.6rem;
}
button#register {
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 700px) {
  label {
    font-size: 0.9rem;
  }
  input {
    padding: 0.2rem;
    font-size: 0.9rem;
  }
  legend {
    font-size: 1rem;
  }
  select {
    width: 177px;
    padding: 0.2rem;
    font-size: 0.9rem;
  }
  button#uploadPicture {
    margin-top: 0.8rem;
    font-size: 0.75rem;
  }
  button#register {
    margin-top: 1rem;
    font-size: 1rem;
  }
}

@media (min-width: 1000px) {
  div#register {
    width: 30%;
  }
  label {
    font-size: 1rem;
  }
  input {
    font-size: 1rem;
    width: 50%;
  }
  select {
    width: 51%;
    font-size: 1rem;
  }
  button#uploadPicture {
    margin-top: 1.5rem;
    font-size: 0.85rem;
  }
  button#register {
    margin-top: 1.5rem;
    font-size: 1.1rem;
  }
}
</style>
