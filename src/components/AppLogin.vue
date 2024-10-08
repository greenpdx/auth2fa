<template>
  <div>
    <div>
      <div>
        <input v-model="fname" />
        <input v-model="lname" />
      </div>
      <br />
      <input type="email" v-model="email" /><br />
      <input type="password" v-model="passwd" /><br />
      <button @click="register" :disabled="enreg">Register</button><br />
      <button @click="login" :disabled="enlin">Login</button>
      <span>{{ userid }}</span
      ><br />
      <button @click="generate" :disabled="engen">Generate</button>
      <button @click="profile" :disabled="enabl">Profile</button>
      <br />
      <div class="dualuse">
        <canvas class="canvas" height="200px" width="200px" id="qrimg" ref="qrimg"></canvas>
        <div class="profiletxt">TEXT</div>
      </div>
      <br />
      <input v-model="key" /><br />
      <button @click="verify" :disabled="enver">Verify</button>
      <button @click="validate" :disabled="enval">Validate</button>
      <br />
      <input v-model="able" @change="disable" type="checkbox" :disabled="enabl" />
      <button @click="disable" :disabled="enabl">Disable</button>
      <br />
      <button @click="logout" :disabled="enlo">Logout</button>
    </div>
  </div>
</template>

<style scoped>
.dualuse {
  width: 200px;
  height: 200px;
  position: relative;
}
.canvas {
  z-index: 3;
}
.profiletxt {
  z-index: 1;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import QRCode from 'qrcode'
import { userAuthStore } from '@/stores/auth'
const uauth = userAuthStore()

const emit = defineEmits(['authuser'])
const props = defineProps({
  //auth: {}
})

const fname = ref('')
const lname = ref('')
const email = ref('')
const passwd = ref('')
const key = ref('')
const userid = ref('NOT Logged in')
const able = ref(false)
const engen = ref(1)
const enval = ref(1)
const enlo = ref(1)
const enver = ref(1)
const enlin = ref(0)
const enreg = ref(0)
const enabl = ref(1)

const BASE_URL = 'http://10.0.42.170:8000'
const URL_REGISTER = '/auth/register'
const URL_LOGIN = '/auth/login'
const URL_GENERATE = '/auth/otp/generate'
const URL_VERIFY = '/auth/otp/verify'
const URL_DISABLE = '/auth/otp/disable'
const URL_VALIDATE = '/auth/otp/validate'
const URL_LOGOUT = '/auth/logout'
const URL_PROFILE = '/auth/profile'

let qr = {}
let user_data = { state: -1 }
let auth = {}

onMounted(() => {
  console.log('MOUNTED', props)
})

/*
TESTS register:
missing field, bad email, bad passwd
 */

async function register(evt) {
  console.log(evt)
  console.log(fname.value, lname.value, email.value, passwd.value)
  let name = fname.value + ' ' + lname.value
  //let email = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/

  let jobj = JSON.stringify({ name: name, email: email.value, password: passwd.value })
  console.log(name, jobj)
  let url = BASE_URL + URL_REGISTER
  axios
    .post(url, jobj, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (resp) {
      console.log(resp)
    })
    .catch(function (err) {
      console.log(err)
    })
}

async function profile(evt) {
  console.log(evt)
  console.log(fname.value, lname.value, email.value, passwd.value)
  let name = fname.value + ' ' + lname.value

  let jobj = JSON.stringify({ user_id: auth.id })
  console.log(name, jobj)
  let url = BASE_URL + URL_PROFILE
  axios
    .post(url, jobj, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (resp) {
      //console.log(resp)
      let user = resp.data.user
      console.log(user)
    })
    .catch(function (err) {
      console.log(err)
    })
}

async function login(evt) {
  console.log(evt)
  console.log(email.value, passwd.value)

  let jobj = JSON.stringify({ email: email.value, password: passwd.value })
  console.log(jobj)
  let url = BASE_URL + URL_LOGIN
  axios
    .post(url, jobj, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (resp) {
      if (resp.data.status != 'success') {
        console.log('Not Success')
        return
      }
      let auser = resp.data.user
      console.log(auser, props)

      auth = auser
      userid.value = auser.id

      uauth.auth = auser

      if (auser.otp_enabled) {
        enver.value = 0
      } else {
        engen.value = 0
      }
      enlo.value = 0
      enlin.value = 1
      enreg.value = 1
      emit('authuser', auser)
      console.log('P', uauth.id)
    })
    .catch(function (err) {
      user_data.status = -1
      console.log(err.message)
      alert('Invalid Input')
    })
}

async function generate(evt) {
  console.log(evt)
  console.log(email.value, auth.id)

  let jobj = JSON.stringify({ email: email.value, user_id: auth.id })
  console.log(jobj)
  let url = BASE_URL + URL_GENERATE
  axios
    .post(url, jobj, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (resp) {
      qr = resp.data
      console.log(qr)
      let canvas = document.getElementById('qrimg')
      console.log(canvas)
      QRCode.toCanvas(canvas, qr.otpauth_url, function (err) {
        console.log(err)
      })
      engen.value = 1
      enver.value = 0
    })
    .catch(function (err) {
      console.log(err)
    })
}

async function verify(evt) {
  console.log(evt)
  console.log(auth.id, key.value)

  let jobj = JSON.stringify({ user_id: auth.id, token: key.value })
  let url = BASE_URL + URL_VERIFY
  axios
    .post(url, jobj, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (resp) {
      let luser = resp.data.user
      console.log(luser)
      if (typeof luser !== 'undefined') {
        enver.value = 1
        enval.value = 0
        enabl.value = 0
        able.value = true
        auth = luser
      } else {
        alert('Bad auth')
      }
    })
    .catch(function (err) {
      console.log(err)
    })
}

async function validate(evt) {
  console.log(evt)
  console.log(auth.id, key.value)

  let jobj = JSON.stringify({ user_id: auth.id, token: key.value })
  let url = BASE_URL + URL_VALIDATE
  axios
    .post(url, jobj, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (resp) {
      let valid = resp.data.otp_valid
      console.log('VALID', valid)
      if (valid) {
        user_data.status = 2
        //enval.value = 1
        //enabl.value = 0
        able.value = true
      } else {
        console.log('VALIDATE: Invalid Try')
        alert('Invalid Try')
      }
    })
    .catch(function (err) {
      console.log(err)
    })
}

async function disable(evt) {
  console.log(evt)
  console.log(auth.id, able.value)

  let jobj = JSON.stringify({ user_id: auth.id })
  console.log(jobj)
  let url = BASE_URL + URL_DISABLE
  axios
    .post(url, jobj, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (resp) {
      console.log(resp)
      able.value = false
      enabl.value = 1
      enval.value = 1
      enlin.value = 0
      enlo.value = 1
      enreg.value = 0
    })
    .catch(function (err) {
      console.log(err)
    })
}

async function logout() {
  let jobj = JSON.stringify({ user_id: auth.id })
  console.log(jobj)
  let url = BASE_URL + URL_LOGOUT
  axios
    .post(url, jobj, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (resp) {
      console.log(resp)
      able.value = false
      enabl.value = 1
      enval.value = 1
      enlin.value = 0
      enlo.value = 1
      enreg.value = 0
    })
    .catch(function (err) {
      console.log(err)
    })
}
</script>
