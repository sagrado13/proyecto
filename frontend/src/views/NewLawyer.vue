<template>
  <div>
    <h3>Regístrate para ser abogado</h3>
    <div id="register">
      <p>{{ msg }}</p>
      <legend>Nombre del bufete*</legend>
      <input type="text" v-model="lawFirm" placeholder="Nombre del bufete" />
      <legend>Dirección*</legend>
      <input type="text" v-model="street" placeholder="Dirección" />
      <legend>Código postal*</legend>
      <input type="text" v-model="zip" placeholder="Código postal" />
      <legend>Localidad*</legend>
      <select v-model="city" name="city">
        <option value>Selecciona la localidad</option>
        <option v-for="province in provinces" :key="province.id" :value="province">{{ province }}</option>
      </select>
      <legend>Teléfono*</legend>
      <input type="tel" required v-model="phoneNumber" placeholder="Teléfono" />
      <legend>Usuario*</legend>
      <input type="text" v-model="login" placeholder="Usuario" />
      <legend>Email*</legend>
      <input type="email" v-model="emailLawyer" placeholder="Email" />
      <legend>Contraseña*</legend>
      <input type="password" v-model="password" placeholder="Contraseña" />
      <input id="upload" type="file" @change="processFile" ref="fileInput" />
      <button id="uploadPicture" @click="$refs.fileInput.click()">Cargar imagen</button>
      <progress max="100" :value.prop="uploadProgress"></progress>
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
      avatar: null,
      uploadProgress: 0,
      msg: "",
      provinces: [
        "A Coruña",
        "Álava",
        "Albacete",
        "Alicante",
        "Almería",
        "Asturias",
        "Avila",
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
      try {
        let fd = new FormData();
        fd.append("lawFirm", this.lawFirm);
        fd.append("street", this.street);
        fd.append("zip", this.zip);
        fd.append("city", this.city);
        fd.append("phoneNumber", this.phoneNumber);
        fd.append("login", this.login);
        fd.append("emailLawyer", this.emailLawyer);
        fd.append("password", this.password);
        fd.append("avatar", this.avatar);
        const response = await axios.post("http://localhost:3000/lawyers", fd, {
          onUploadProgress: (uploadEvent) => {
            this.uploadProgress = Math.round(
              (uploadEvent.loaded / uploadEvent.total) * 100
            );
          },
        });
        Swal.fire({
          title: "Abogado añadido correctamente",
          icon: "success",
          confirmButtonText: "OK",
        });
        this.$route.push("/");
        location.reload();
      } catch (error) {
        this.msg = error.response.data.message;
        console.log(error);
      }
    },
    /*     validatingData() {
      if (
        this.lawFirm === "" ||
        this.street === "" ||
        this.zip === "" ||
        this.city === "" ||
        this.login === "" ||
        this.emailLawyer === "" ||
        this.password === ""
      ) {
        this.errorMsg = true;
        this.createLawyer = false;
        Swal.fire({
          icon: "error",
          title: "Tienes campos vacíos",
        });
      } else {
        this.errorMsg = false;
        this.createLawyer = true;
        this.addNewLawyers();
      }
    }, */
  },
};
</script>

<style scoped>
h3 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}
div#register {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  box-sizing: border-box;
  border-radius: 20px;
  width: 70%;
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: rgb(108, 109, 110);
}
legend {
  font-size: 0.8rem;
  margin-top: 1rem;
}
input {
  outline: 0;
  border-width: 0 0 1px;
  border-color: yellowgreen;
  font-size: 0.7rem;
  text-align: center;
  background: rgb(22, 22, 22);
  color: white;
  padding: 0.1rem;
}
select {
  outline: 0;
  font-size: 0.7rem;
  width: 70%;
  background-color: black;
  color: white;
  border-width: 0 0 1px;
  border-color: yellowgreen;
  padding: 0.1rem;
}
input#upload {
  display: none;
}
button {
  font-size: 0.7rem;
  border-radius: 20px;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  box-shadow: 5px 5px 30px white inset;
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
  legend {
    font-size: 0.9rem;
  }
  input {
    padding: 0.2rem;
    font-size: 0.9rem;
  }
  select {
    width: 35%;
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
  legend {
    font-size: 1rem;
  }
  input {
    font-size: 1rem;
    width: 50%;
  }
  select {
    width: 50%;
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
