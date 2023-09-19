<template lang="">
  <form class="addform" @submit.prevent="addData">
    <div class="input-form">
      <div class="field has-addons">
        <div class="control">
          <label for="author">Supplier</label>
          <select id="author" v-model="supplier" class="input">
            <option value="">Pilih Supplier</option>
            <option value="Indah">Indah</option>
            <option value="Leni">Leni</option>
            <option value="Lisa">Lisa</option>
            <option value="Meta">Meta</option>
            <option value="Dani">Dani</option>
            <option value="Bunda Qory">Bunda Qory</option>
            <option value="Kris Juniati">Kris Juniati</option>
            <option value="Nur">Nur</option>
            <option value="Fiza">Fiza</option>
            <option value="Citra">Citra</option>
            <option value="Bunda Lutfi">Bunda Lutfi</option>
            <option value="Bunda Nessa">Bunda Nessa</option>
          </select>
        </div>
        <div class="control">
          <label for="foodTitle">Nama Makanan</label>
          <input
            id="foodTitle"
            v-model="foodTitle"
            class="input"
            type="text"
            placeholder="Nama Makanan"
          />
        </div>
        <div class="control">
          <label for="amount">Jumlah</label>
          <input
            id="amount"
            v-model="amount"
            class="input"
            type="number"
            placeholder="amount"
          />
        </div>
        <div class="control">
          <label for="price">Harga Jual</label>
          <input
            id="price"
            v-model="price"
            class="input"
            type="number"
            placeholder="price"
          />
        </div>
        <div class="control">
          <label for="date">Tanggal</label>
          <input
            id="date"
            title="date"
            v-model="date"
            class="input"
            type="date"
          />
        </div>

        <div class="control">
          <label style="color: transparent" for="">.</label>
          <button :disabled="!supplier" class="button is-info">
            Tambah Transaksi
          </button>
        </div>
      </div>
    </div>
  </form>

  <h1
    style="
      font-size: 30px;
      text-align: center;
      margin-top: 20px;
      margin-bottom: 30px;
      font-weight: 700;
      color: burlywood;
    "
  >
    DAFTAR JUALAN KANTIN SMP SMA ISLAM 
    <br>DE GREEN CAMP HARI INI
  </h1>

  <div class="table-container">
    <table class="transaction-table">
      <thead>
        <tr>
          <th>No</th>
          <th>Tanggal</th>
          <th>Supplier</th>
          <th>Nama Makanan</th>
          <th>Jumlah Supply</th>
          <th>Harga Makanan</th>
          <th>Komisi Kantin</th>
          <th>Untuk Supplier</th>
          <th>Terjual</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data,index) in filteredDatasForToday" :key="data.id">
          <td>{{ index+1 }}</td>
          <td>{{ data.date }}</td>
          <td>{{ data.supplier }}</td>
          <td>{{ data.foodTitle }}</td>
          <td>{{ data.amount }}</td>
          <td>Rp {{ formatNumberWithCommas(data.price) }}</td>
          <td>Rp {{ calculateCommission(data.price) }}</td>
          <td>
            Rp
            {{
              formatNumberWithCommas(
                data.price - calculateCommission(data.price)
              )
            }}
          </td>
          <td>{{ data.terjual }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase";
import { startOfDay } from "date-fns";


const amount = ref("");
const supplier = ref("");
const date = ref("");
const price = ref("");
const foodTitle = ref("");

const transactionCollectionQuery = query(
  collection(db, "kantin"),
  orderBy("date", "asc")
  // limit(10)
);
const datas = ref([]);
const filteredDatas = ref([]);


onMounted(() => {
  loadDatas();
});

const loadDatas = () => {
  onSnapshot(transactionCollectionQuery, (querySnapshot) => {
    const fbData = [];
    const supplierNames = []; // Array untuk menyimpan nama supplier
    const amountArray = [];
    const terjualArray = [];
    const foodTitleArray = [];

    querySnapshot.forEach((doc) => {
      const data = {
        id: doc.id,
        amount: doc.data().amount,
        date: doc.data().date,
        foodTitle: doc.data().foodTitle,
        price: doc.data().price,
        supplier: doc.data().supplier,
        terjual: doc.data().terjual,
      };

      fbData.push(data);
    });

    datas.value = fbData;
    filteredDatas.value = fbData;

  });
};

const currentDate = new Date();
const startOfCurrentDay = startOfDay(currentDate);

const filteredDatasForToday = computed(() => {
  return filteredDatas.value.filter((data) => {
    const dataDate = new Date(data.date);
    return startOfDay(dataDate).getTime() === startOfCurrentDay.getTime();
  });
});


const addData = () => {
  const supplierData = {
    amount: amount.value,
    supplier: supplier.value,
    date: date.value,
    foodTitle: foodTitle.value,
    price: price.value,
  };

  addDoc(collection(db, "kantin"), supplierData);

  amount.value = "";
  supplier.value = "";
  date.value = "";
  foodTitle.value = "";
  price.value = "";
};


const formatNumberWithCommas = (number) => {
  let numStr = number.toString();
  let groups = [];
  while (numStr.length > 0) {
    groups.unshift(numStr.slice(-3));
    numStr = numStr.slice(0, -3);
  }
  let formattedValue = groups.join(".");
  return formattedValue;
};

const calculateCommission = (price) => {
  if (price > 6000) {
    return 500;
  } else if (price >= 2500 && price <= 6000) {
    return 300;
  }
};
</script>

<style>


</style>
