<script setup>
import { RouterLink, RouterView } from "vue-router";
import { onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import router from "./router";

const isLoggedIn = ref(false);

let user = ref(null); // Menambahkan inisialisasi variabel user

onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      isLoggedIn.value = true;
      user.value = firebaseUser; // Menyimpan informasi pengguna dalam variabel user
    } else {
      isLoggedIn.value = false;
      user.value = null; // Reset informasi pengguna saat keluar
    }
  });
});

let auth;
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
  });
});

const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push("/");
  });
};
</script>

<template>
  <header>
    <h1 style="color: white; font-size: 30px">DGC-Kantin<br /></h1>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink> |
        <RouterLink to="/admin">Admin</RouterLink> |
        <RouterLink to="/login">Login</RouterLink> |
        <RouterLink to="/putra">Putra</RouterLink> |
        <RouterLink to="/putri">Putri</RouterLink> |
        <p class="user" v-if="isLoggedIn">{{ user.email.slice(0,7) }}</p> |
        <button @click="handleSignOut" v-if="isLoggedIn" style="padding: 5px 10px;border-radius: 10px;">Sign Out</button>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style>
@import "node_modules\bulma\css\bulma.min.css";

@media (max-width: 800px) {
  form {
    margin-top: 20px;
    width: 90%;
  }
}

.user{
  color: antiquewhite;
}


label {
  display: block;
  margin-bottom: 8px;
  color: #e6e6e6;
}

header {
  padding: 10px 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

header .title {
  text-align: center;
  color: aliceblue;
}


nav {
  width: 100%;
  font-size: 18px;
  text-align: center;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

nav a.router-link-exact-active {
  color: white;
  background-color: rgb(91, 194, 91);
  border-radius: 10px;
  font-weight: 700;
}

nav a.router-link-exact-active:hover,
button:hover {
  background-color: rgb(91, 194, 91);
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  color: white;
  border-radius: 10px;
}

nav a:hover {
  background-color: rgb(91, 194, 91);
}

nav a:first-of-type {
  border: 0;
}

h1 {
  text-align: center;
}

@media screen and (max-width: 600px) {
  header{
    flex-direction: column;
  }
}
</style>
