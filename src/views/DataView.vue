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
    <button style="padding: 20px; width: 200px" @click="openCommissionModal">
      Hitung Komisi Supplier
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
        <tr style="text-align:center">
          <th style="text-align:center;width:20px">No</th>
          <th style="text-align:center;width:150px">Tanggal</th>
          <th>Supplier</th>
          <th>Nama Makanan</th>
          <th>Jumlah Supply</th>
          <th>Harga Makanan</th>
          <th>Komisi Kantin</th>
          <th>Untuk Supplier</th>
          <th>Terjual</th>
          <th style="text-align:center;width:150px">Total Kantin</th>
          <th style="text-align:center;width:150px">Total Supplier</th>
          <th style="text-align:center;width:150px">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr style="text-align:center" v-for="(data,index) in filteredDatas" :key="data.id">
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
          <td>Rp {{ calculateCommission(data.price) * data.terjual }}</td>
          <td>
            Rp
            {{
              formatNumberWithCommas(
                (data.price - calculateCommission(data.price)) * data.terjual
              )
            }}
          </td>
          <td>
            <button @click="openEditModal(data.id)" class="edit-button">
              Edit
            </button>
            <button @click="deleteData(data.id)" class="delete-button">
              Hapus
            </button>
          </td>
        </tr>
        <tr>
          <td colspan="9" style="text-align: center; font-weight: 700">
            Total
            <span style="color: gray">{{ startDate }} s/d {{ endDate }}</span> (
            Rp
            {{
              formatNumberWithCommas(
                calculateTotalKantin() + calculateTotalSupplier()
              )
            }}
            )
          </td>
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
          <label class="label">Tanggal</label>
          <div class="control">
            <input
              v-model="editDate"
              class="input"
              type="date"
              placeholder="Tanggal"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Supplier</label>
          <div class="control">
            <input
              v-model="editSupplier"
              class="input"
              type="text"
              placeholder="Supplier"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Nama Makanan</label>
          <div class="control">
            <input
              v-model="editFoodTitle"
              class="input"
              type="text"
              placeholder="Nama Makanan"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Jumlah</label>
          <div class="control">
            <input
              v-model="editAmount"
              class="input"
              type="number"
              placeholder="Jumlah"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Supply Putra</label>
          <div class="control">
            <input
              v-model="supplyPutra"
              class="input"
              type="number"
              placeholder="Masukkan Jumlah Terjual"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Supply Putri</label>
          <div class="control">
            <input
              v-model="supplyPutri"
              class="input"
              type="number"
              placeholder="Masukkan Jumlah Terjual"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Harga</label>
          <div class="control">
            <input
              v-model="editPrice"
              class="input"
              type="number"
              placeholder="Price"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Terjual</label>
          <div class="control">
            <input
              v-model="editTerjual"
              class="input"
              type="number"
              placeholder="Masukkan Jumlah Terjual"
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

  <div class="modal" :class="{ 'is-active': commissionModalOpen }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Hitung Komisi Supplier</p>
        <button
          class="delete"
          aria-label="close"
          @click="closeCommissionModal"
        ></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Nama Supplier</label>
          <div class="control">
            <select
              v-model="selectedSupplier"
              class="input"
              @change="calculateCommissionTotal"
            >
              <option value="">Semua Supplier</option>
              <!-- Tambahkan pilihan nama supplier di sini -->
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
        </div>
        <div class="field">
          <label class="label">Rentang Tanggal</label>
          <div class="control">
            <input
              style="width: 200px"
              id="commissionStartDate"
              v-model="startDate1"
              @change="calculateCommissionTotal"
              class="input"
              type="date"
            />
            <span style="color: white">s/d</span>
            <input
              style="width: 200px"
              id="commissionEndDate"
              v-model="endDate1"
              @change="calculateCommissionTotal"
              class="input"
              type="date"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Total Komisi Supplier</label>
          <div class="control">
            <input
              v-model="commissionTotal"
              class="input"
              type="text"
              disabled
            />
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button @click="closeCommissionModal" class="button">Tutup</button>
      </footer>
    </div>
  </div>
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
import jsPDF from "jspdf";

const downloadAsPDF = () => {
  const screenshotElement = document.querySelector(".table-container");

  html2canvas(screenshotElement).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("reportKantin.pdf");
  });
};

const amount = ref("");
const supplier = ref("");
const date = ref("");
const price = ref("");
const foodTitle = ref("");

const filterData = ref("");
const startDate = ref("");
const startDate1 = ref("");
const endDate = ref("");
const endDate1 = ref("");

const editDate = ref("");
const editingDataId = ref("");
const editSupplier = ref("");
const editFoodTitle = ref("");
const editAmount = ref("");
const editModalOpen = ref(false);
const editTerjual = ref("");
const supplyPutra = ref("");
const supplyPutri = ref("");

const editPrice = ref("");

const commissionModalOpen = ref(false);
const selectedSupplier = ref(""); // Untuk menyimpan nama supplier yang dipilih pada filter
const commissionTotal = ref(0); // Untuk menyimpan total komisi supplier

const openCommissionModal = () => {
  commissionModalOpen.value = true;
};

const closeCommissionModal = () => {
  commissionModalOpen.value = false;
};

const calculateCommissionTotal = () => {
  // Filter data berdasarkan supplier dan rentang tanggal
  const filteredData = filteredDatas.value.filter((data) => {
    const dataDate = new Date(data.date);
    const isSupplierMatching =
      selectedSupplier.value === "" || data.supplier === selectedSupplier.value;
    const isDateInRange =
      dataDate >= new Date(startDate1.value) &&
      dataDate <= new Date(endDate1.value);

    return isSupplierMatching && isDateInRange;
  });

  // Hitung total komisi supplier
  commissionTotal.value = filteredData.reduce((total, data) => {
    return (
      total + (data.price - calculateCommission(data.price)) * data.terjual
    );
  }, 0);
};

const editData = async (id) => {
  const dataIndex = datas.value.findIndex((t) => t.id === id);
  if (dataIndex !== -1) {
    const editedData = {
      amount: editAmount.value,
      supplier: editSupplier.value,
      date: editDate.value,
      terjual: editTerjual.value,
      price: editPrice.value,
      foodTitle: editFoodTitle.value,
      supplyPutra: supplyPutra.value,
      supplyPutri: supplyPutri.value,
      
    };

    try {
      await updateDoc(doc(db, "kantin", id), editedData);
      datas.value[dataIndex] = {
        ...datas.value[dataIndex],
        ...editedData,
      };
      filterDatas();
      closeEditModal();
    } catch (error) {
      console.error("Error editing transaction:", error);
      // Handle error here (e.g., show an error message)
    }
  }
  

};

const openEditModal = (id) => {
  const data = datas.value.find((t) => t.id === id);
  if (data) {
    editAmount.value = data.amount;
    editDate.value = data.date;
    editFoodTitle.value = data.foodTitle; // Populate editDate
    editPrice.value = data.price; // Populate editTransactionType
    editSupplier.value = data.supplier;
    editTerjual.value = data.terjual;
    supplyPutra.value = data.putra;
    supplyPutri.value = data.putri;
    

    editingDataId.value = id;
    editModalOpen.value = true;
  }
};

const closeEditModal = () => {
  editAmount.value = "";
  editSupplier.value = "";
  editDate.value = ""; // Clear editDate
  editTerjual.value = ""; // Clear editTransactionType
  editPrice.value = "";
  editFoodTitle.value = "";
  supplyPutra.value = "";
  supplyPutri.value = "";
  

  editingDataId.value = "";
  editModalOpen.value = false;
};

const deleteData = async (id) => {
  deleteDoc(doc(db, "kantin", id));
  filterDatas();
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
        putra: doc.data().supplyPutra,
        putri: doc.data().supplyPutri,
       
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
    return total + calculateCommission(data.price) * data.terjual;
  }, 0);
};

const calculateTotalSupplier = () => {
  return filteredDatas.value.reduce((total, data) => {
    return (
      total + (data.price - calculateCommission(data.price)) * data.terjual
    );
  }, 0);
};

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

.table-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-top: 20px;
}

.transaction-table {
  border-collapse: collapse;
  margin: 40px;
  font-size: 16px;
}

.transaction-table th,
.transaction-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.transaction-table th {
  background-color: #f2f2f2;
}
.transaction-table tr {
  background-color: #ddd;
}
.transaction-table tr:hover {
  background-color: #80c972;
}

.edit-button {
  background-color: #4a9c3a;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
}

.delete-button {
  background-color: #e57373;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
}

.delete-button:hover {
  background-color: #d32f2f;
}

.addform {
  width: 100%;
  margin-top: 50px;
  background-color: rgb(22, 22, 22);
  padding: 10px 30px 30px 20px;
  border-radius: 20px;
}

.input-form {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  align-items: center;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

@media (min-width: 1000px) {
  .container {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

.content .btn-group {
  width: 100%;
  display: flex;
  justify-content: center;
}

@media (max-width: 800px) {
  .input-form .field {
    flex-direction: column;
    place-items: center;
    width: 300px;
  }
  .input-form .field .control {
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .input-form .field .control input {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .input-form .field .control button {
    width: 100%;
  }
  .input-form .field .control label:not(:first-child) {
    margin-top: 10px;
  }
  #dTime {
    margin-top: 20px;
  }
}
</style>
