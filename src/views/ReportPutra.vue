<template lang="">
  <div
    style="
      display: flex;
      align-items: center;
      margin: 20px 0;
      justify-content: center;
      gap: 20px;
    "
  >
    <button style="padding: 20px; width: 200px" @click="downloadAsPDF">
      Download as PDF
    </button>
  </div>


  <div
    style="
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 50px;
    "
  >
    <label style="text-align: center; font-size: 20px" for=""></label>
    <div style="display: flex; gap: 10px; align-items: center">
      <input
        style="width: 200px"
        id="startDate"
        v-model="startDate"
        @change="filterDatas"
        class="input"
        type="date"
      />
      <span style="color: white">s/d</span>
      <input
        style="width: 200px"
        id="endDate"
        v-model="endDate"
        @change="filterDatas"
        class="input"
        type="date"
      />
    </div>
  </div>

  <div class="table-container">
    
    <table
      class="transaction-table"
      style="
        padding: 20px;
        width: 50%;
        position: relative;
        left: 50%;
        transform: translateX(-57%);
      "
    >
      <thead>
        <tr>
          <th>Tanggal</th>
          <th>Omset</th>
          <th>Real</th>
          <th>Selisih</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in filteredDatas" :key="data.id">
          <td>{{ data.reportDate }}</td>
          <td>Rp {{ formatNumberWithCommas(data.omsetKantin) }}</td>
          <td>Rp {{ formatNumberWithCommas(data.realMoney) }}</td>
          <td>
            Rp {{ formatNumberWithCommas(data.realMoney - data.omsetKantin) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <form class="addform" @submit.prevent="addReport">
    <div class="input-form">
      <div class="field has-addons">
        <div class="control">
          <label for="reportDate">Tanggal</label>
          <input
            id="reportDate"
            v-model="reportDate"
            class="input"
            type="date"
            placeholder="Tanggal"
          />
        </div>
        <div class="control">
          <label for="omsetKantin">Jumlah Omset Kantin</label>
          <input
            id="omsetKantin"
            v-model="omsetKantin"
            class="input"
            type="number"
            placeholder="amount"
          />
        </div>
        <div class="control">
          <label for="realMoney">Jumlah Uang Real</label>
          <input
            id="realMoney"
            v-model="realMoney"
            class="input"
            type="number"
            placeholder="price"
          />
        </div>
        <div class="control">
          <label style="color: transparent" for="">.</label>
          <button :disabled="!realMoney" class="button is-info">
            Buat Laporan
          </button>
        </div>
      </div>
    </div>
  </form>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import html2canvas from "html2canvas"; // Import html2canvas
import { startOfDay } from "date-fns";

const downloadAsPDF = () => {
  const screenshotElement = document.querySelector(".table-container");

  html2canvas(screenshotElement).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");

    // Buat sebuah tautan untuk mengunduh gambar
    const a = document.createElement("a");
    a.href = imgData;
    a.download = "RekapKantinPutra.png"; // Nama file yang akan diunduh
    a.click();
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

const reportDate = ref("");
const omsetKantin = ref("");
const realMoney = ref("");

const filterData = ref("");
const startDate = ref("");
const endDate = ref("");

const addReport = () => {
  const reportData = {
    reportDate: reportDate.value,
    omsetKantin: omsetKantin.value,
    realMoney: realMoney.value,
  };

  addDoc(collection(db, "kantinReport"), reportData);

  reportDate.value = "";
  omsetKantin.value = "";
  realMoney.value = "";
};

const transactionCollectionQuery = query(
  collection(db, "kantinReport")
  // orderBy("supplier", "asc")
);

const datas = ref([]);
const filteredDatas = ref([]);

onMounted(() => {
  loadDatas();
});

const loadDatas = () => {
  onSnapshot(transactionCollectionQuery, (querySnapshot) => {
    const fbData = [];
    querySnapshot.forEach((doc) => {
      const data = {
        id: doc.id,
        realMoney: doc.data().realMoney,
        reportDate: doc.data().reportDate,
        omsetKantin: doc.data().omsetKantin,
      };
      fbData.push(data);
    });
    datas.value = fbData;
    filteredDatas.value = fbData;
  });
};

const filterDatas = () => {
  const selectedName = filterData.value;
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  filteredDatas.value = datas.value.filter((data) => {
    const dataDate = new Date(data.reportDate);

    // Check if the transaction type matches the selected type and falls within the date range
    const isNameMatching =
      selectedName === "" || data.supplier === selectedName;
    const isDateInRange = dataDate >= start && dataDate <= end;

    return isNameMatching && isDateInRange;
  });
};

const calculateTotalKantin = () => {
  return filteredDatas.value.reduce((total, data) => {
    return total + calculateCommission(data.price) * data.salesPutra;
  }, 0);
};

const calculateTotalSupplier = () => {
  return filteredDatas.value.reduce((total, data) => {
    return (
      total + (data.price - calculateCommission(data.price)) * data.salesPutra
    );
  }, 0);
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

<style></style>
