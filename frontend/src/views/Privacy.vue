<template>
  <div>
    <!-- Declaramos vue-headful -->
    <vue-headful title="Política de privacidad" />

    <!-- POLÍTICA DE PRIVACIDAD -->
    <h2>Política de Privacidad</h2>
    <h5>1. OBJETO Y FINALIDAD</h5>
    <p>
      La presente política de privacidad informa al usuario, sobre el trato y
      almacenaje que Legal Shield, pueda realizar de los datos de carácter
      personal facilitados por los usuarios.
    </p>
    <p>
      Estos datos facilitados por el usuario, son recabados con la finalidad de
      facilitar la prestación de servicios por parte de un Legal Shield
    </p>
    <p>
      El trato que reciban los datos de carácter personal, será conforme en todo
      momento el establecido por la Ley Orgánica 3/2018, de 5 de diciembre, de
      Protección de Datos Personales y garantía de los derechos digitales (en
      adelante LOPDGDD)
    </p>
    <h5>2. ALMACENAMIENTO</h5>
    <p>
      Los datos de caracter personal, facilitados por los usuarios, seran
      almacenados en ficheros automatizados creados por Legal Shield y bajo su
      responsabilidad.
    </p>
    <h5>3. VERACIDAD DE LOS DATOS</h5>
    <p>
      El usuario se compromete y garantiza que los datos facilitados son veraces
      y ajustados a la realidad.
    </p>
    <p>
      El usuario se compromete a indicar en el periodo mas breve posible
      cualquier cambio o modificacion de los datos facilitados a Legal Shield
    </p>
    <h5>4. DERECHO DE ACCESO, RECTIFICACIÓN, OPOSICION Y CANCELACION</h5>
    <p>
      En cumplimiento de la LOPDGDD el interesado podra ejercer su derecho de
      acceso, rectificación, cancelación, y oposición mediante el envio de
      notificacion a legalshield5.33@gmail.com
    </p>
    <p>
      Dicha comunicacion se tendra que poseer: a) Escrito en el que consten
      nombre, apellidos, NIF, derecho y contenido de la solicitud, domicilio a
      efectos de notificaciones b) Fotocopia DNI
    </p>
    <h5>5. CONSENTIMIENTO</h5>
    <p>
      Los datos recabados por Legal Shield, siempre seran facilitados con el
      consentimiento de su titular, de forma expresa al rellenar alguno de los
      formularios del Website o se entendera dada la conformidad del titular de
      forma tacita quando estos se envien alguno de los mail de contacto.
    </p>
    <h5>6. CONFIDENCIALIDAD Y CESIÓN DE DATOS</h5>
    <p>
      Legal Shield se compromete a cumplir con el deber de secreto y
      confidencialidad respecto de los datos personales contenidos en el fichero
      automatizado de acuerdo con la legislación aplicable, así como a
      conferirles un tratamiento seguro en las cesiones de datos que, en su
      caso, puedan producirse.
    </p>
    <p>
      Legal Shield únicamente cederá, comunicará o revelará sus datos personales
      cuando usted haya rellenado los datos de contacto necesarios para poder
      enviarselos a un abogado, abogados o otras plataformas/empresas para que
      así puedan satisfacer la consulta que nos ha hecho llegar.
    </p>
    <p>
      Dicha comunicación, cesión o revelación sea amparada por la legislación
      vigente.
    </p>
    <h5>7. SEGURIDAD</h5>
    <p>
      Legal Shield mantiene los niveles de seguridad de protección de datos
      personales conforme al Real Decreto Ley 5/2018, de 27 de julio, relativo a
      las medidas de seguridad de los ficheros automatizados que contengan datos
      de carácter personal, y ha establecido todos los medios técnicos a su
      alcance para evitar la pérdida, mal uso, alteración, acceso no autorizado
      y robo de los datos que el usuario facilite a través del sitio web.
    </p>
    <p>
      Considerando que las medidas de seguridad en Internet no son inexpugnables
      Legal Shield no se hace responsable de los daños y perjuicios que se
      pudieran causar por la perdida mal uso, alteración, acceso no autorizado y
      robo de algunos de los datos, si no concurriera culpa por un
      comportamiento imprudente o intencionado.
    </p>
    <h5>8. COMUNICACIONES ELECTRONICAS</h5>
    <p>
      Legal Shield puede realizar comunicaciones a sus usuarios mediante los
      datos facilitados mediante el envió de un boletín en el que se incluyen
      las noticias, novedades e información más relevantes del website, o
      mediante comunicaciones comerciales que contengan información de otros
      productos, servicios y/o eventos que puedan interesar al usuario
    </p>
    <p>
      Estas notificaciones se realizaran con el previo consentimiento del
      usuario y se podrá suspender el servicio notificando dicha voluntad a
      Legal Shield
    </p>
  </div>
</template>

<script>
export default {
  name: "Privacy",
  methods: {
    // FUNCIÓN PARA ABRIR PÁGINA CON EL SCROLL ARRIBA
    position() {
      window.scrollTo(top);
    },
  },
  created() {
    this.position();
  },
};
</script>

<style scoped>
div {
  padding: 0.5rem;
  background-color: var(--bright);
}
h5 {
  margin: 0.5rem;
  text-decoration: underline;
  text-align: left;
  color: var(--dark);
}
p {
  margin-top: 0.5rem;
  text-align: left;
  font-size: 0.8rem;
}

@media (min-width: 700px) {
  div {
    padding: 1rem;
  }
  h5 {
    margin-top: 1rem;
  }
  p {
    font-size: 0.9rem;
  }
}

@media (min-width: 1000px) {
  div {
    width: 60%;
    margin: 0 auto;
  }
  p {
    margin-top: 0.5rem;
    text-align: left;
    font-size: 1rem;
  }
}
</style>
