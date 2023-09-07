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

  <div style="display: flex; flex-direction: column; align-items: center">
    <label style="text-align: center; font-size: 20px" for="">Filter</label>
    <select
      style="width: 250px"
      id="author"
      @change="filterDatas"
      v-model="filterData"
      class="input"
    >
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
    <h1
      style="
        color: white;
        font-size: 40px;
        margin: 40px;
        background-color: black;
        border-radius: 10px;
        padding: 20px 0;
      "
    >
      Rekap Data Kantin : <br />
      {{ startDate }} s/d {{ endDate }}
    </h1>
    <table class="transaction-table" style="padding: 20px">
      <thead>
        <tr>
          <th>Tanggal</th>
          <th>Supplier</th>
          <th>Nama Makanan</th>
          <th>Supply Putri</th>
          <th>Harga Makanan</th>
          <th>Komisi Kantin</th>
          <th>Untuk Supplier</th>
          <th>Terjual Putri</th>
          <th>Total Kantin</th>
          <th>Total Supplier</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in filteredDatasForToday" :key="data.id">
          <td>{{ data.date }}</td>
          <td>{{ data.supplier }}</td>
          <td>{{ data.foodTitle }}</td>
          <td>{{ data.putri }}</td>
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
          <td>{{ data.salesPutri }}</td>
          <td>Rp {{ calculateCommission(data.price) * data.salesPutri }}</td>
          <td>
            Rp
            {{
              formatNumberWithCommas(
                (data.price - calculateCommission(data.price)) * data.salesPutri
              )
            }}
          </td>
          <td>
            <button @click="openEditModal(data.id)" class="edit-button">
              Edit
            </button>
          </td>
        </tr>
        <tr>
          <td colspan="8" style="text-align: right; font-weight: 700">Total</td>
          <td id="totalKantin" style="text-align: left; font-weight: 700">
            Rp {{ formatNumberWithCommas(calculateTotalKantin()) }}
          </td>
          <td id="totalSupplier" style="text-align: left; font-weight: 700">
            Rp {{ formatNumberWithCommas(calculateTotalSupplier()) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="modal" :class="{ 'is-active': editModalOpen }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit Data</p>
        <button
          class="delete"
          aria-label="close"
          @click="closeEditModal"
        ></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Supply Putri</label>
          <div class="control">
            <input
              v-model="supplyPutri"
              class="input"
              type="number"
              placeholder="Masukkan Jumlah Supply Putri"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Terjual Putri</label>
          <div class="control">
            <input
              v-model="salesPutri"
              class="input"
              type="number"
              placeholder="Masukkan Jumlah Terjual Putri"
            />
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button @click="editData(editingDataId)" class="button is-success">
          Simpan
        </button>
        <button class="button" @click="closeEditModal">Batal</button>
      </footer>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import {
  collection,
  onSnapshot,
  doc,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import html2canvas from "html2canvas"; // Import html2canvas
import jsPDF from "jspdf";
import { startOfDay } from "date-fns";

const downloadAsPDF = () => {
  const screenshotElement = document.querySelector(".table-container");

  html2canvas(screenshotElement).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("RekapKantinPutri.pdf");
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

const filterData = ref("");
const startDate = ref("");
const endDate = ref("");

const editDate = ref("");
const editingDataId = ref("");
const editSupplier = ref("");
const editFoodTitle = ref("");
const editAmount = ref("");
const editModalOpen = ref(false);
const editTerjual = ref("");
const supplyPutri = ref("");
const salesPutri = ref("");
const editPrice = ref("");

const editData = async (id) => {
  const dataIndex = datas.value.findIndex((t) => t.id === id);
  if (dataIndex !== -1) {
    const editedData = {
      supplyPutri: supplyPutri.value,
      salesPutri: salesPutri.value,
    };

    try {
      await updateDoc(doc(db, "kantin", id), editedData);
      datas.value[dataIndex] = {
        ...datas.value[dataIndex],
        ...editedData,
      };
      closeEditModal();
    } catch (error) {
      console.error("Error editing transaction:", error);
      // Handle error here (e.g., show an error message)
    }
  }

  filterDatas();
};

const openEditModal = (id) => {
  const data = datas.value.find((t) => t.id === id);
  if (data) {
    editAmount.value = data.amount;
    editDate.value = data.date;
    editFoodTitle.value = data.foodTitle;
    editPrice.value = data.price;
    editSupplier.value = data.supplier;
    editTerjual.value = data.terjual;
    supplyPutri.value = data.putri;
    salesPutri.value = data.salesPutri;

    editingDataId.value = id;
    editModalOpen.value = true;
  }
};

const closeEditModal = () => {
  editAmount.value = "";
  editSupplier.value = "";
  editDate.value = "";
  editTerjual.value = "";
  editPrice.value = "";
  editFoodTitle.value = "";
  supplyPutri.value = "";
  salesPutri.value = "";

  editingDataId.value = "";
  editModalOpen.value = false;
};

const transactionCollectionQuery = query(
  collection(db, "kantin"),
  orderBy("supplier", "asc")
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

    querySnapshot.forEach((doc) => {
      const data = {
        id: doc.id,
        amount: doc.data().amount,
        date: doc.data().date,
        foodTitle: doc.data().foodTitle,
        price: doc.data().price,
        supplier: doc.data().supplier,
        terjual: doc.data().terjual,
        putri: doc.data().supplyPutri,
        salesPutri: doc.data().salesPutri,
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
    const dataDate = new Date(data.date);

    // Check if the transaction type matches the selected type and falls within the date range
    const isNameMatching =
      selectedName === "" || data.supplier === selectedName;
    const isDateInRange = dataDate >= start && dataDate <= end;

    return isNameMatching && isDateInRange;
  });
};

const calculateTotalKantin = () => {
  return filteredDatas.value.reduce((total, data) => {
    return total + calculateCommission(data.price) * data.salesPutri;
  }, 0);
};

const calculateTotalSupplier = () => {
  return filteredDatas.value.reduce((total, data) => {
    return (
      total + (data.price - calculateCommission(data.price)) * data.salesPutri
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

<style>

</style>
