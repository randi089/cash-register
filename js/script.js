const input = document.getElementById("cash");
const buttonPurchase = document.getElementById("purchase-btn");
const Changedue = document.getElementById("change-due");
const changeInDrawer = document.querySelector(".cash-drawer-display");

let price = 3.26;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

buttonPurchase.addEventListener("click", function () {
  const inputValue = input.value;
  input.value = "";
  if (inputValue < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  } else if (inputValue == price) {
    Changedue.innerHTML = "<p>No change due - customer paid with exact cash</p>";
    return;
  }

  checkCashRegister(price, inputValue, cid);
});

function checkCashRegister(price, cash, cidrawer) {
  // total kembalian dikali 100
  let totalKembalian = cash * 100 - price * 100;

  //   hitung jumlah uang didalam mesin kasir dikali 100
  let totalUangDiMesinKasir = cidrawer.map((el) => el[1]).reduce((acc, curr) => acc + curr * 100, 0);

  //   Nama Uang
  const namaUang = ["Pennies", "Nickels", "Dimes", "Quarters", "Ones", "Fives", "Tens", "Twenties", "Hundreds"];

  //   Panduan satuan dan pecahan uang dikalikan 100
  const rumusUang = {
    PENNY: 1,
    NICKEL: 5,
    DIME: 10,
    QUARTER: 25,
    ONE: 100,
    FIVE: 500,
    TEN: 1000,
    TWENTY: 2000,
    "ONE HUNDRED": 10000,
  };

  // pengecekan kondisi
  //   Kondisi 1, ketika kembalian tidak cukup
  if (totalKembalian > totalUangDiMesinKasir) {
    Changedue.innerHTML = "<p>status: INSUFFICIENT_FUNDS</p>";
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  //   Kondisi 2, ketika uang kembalian sama dengan total uang dikasir
  else if (totalKembalian === totalUangDiMesinKasir) {
    Changedue.innerHTML = "<p>status: CLOSED</p>";
    changeInDrawer.innerHTML = "<p><strong>Change in drawer:</strong></p>";
    cid.forEach((uang, index) => {
      changeInDrawer.innerHTML += `<p>${namaUang[index]}: $0</p>`;
      if (uang[1] > 0) {
        Changedue.innerHTML += `<p>${uang[0]}: $${uang[1]}</p>`;
      }
    });
    return { status: "CLOSED", change: cid };
  }

  //   Kondisi 3, jika total kembalian lebih kecil dari uang yang ada di kasir
  // kembalikan uang dengan urutan yang lebih besar dahulu
  else {
    // urutkan uang dikasir dari yang terbesar
    cidrawer = cidrawer.reverse();

    // siapkan uang kembalian dalam bentuk array
    const jumlahUangYangDikembalikan = [];

    // kita telusuri setiap slot uang di mesin kasir
    cidrawer.forEach((uang) => {
      // set kondisi awal dari uang baru
      let kondisiUangBaru = [uang[0], 0];

      // satuan nama pecahan
      const satuan = uang[0];

      // jumlah uang
      let pecahan = uang[1] * 100;

      //   cek uang berdasarkan satuan kurangi jika kembalian masih memenuhi
      while (totalKembalian >= rumusUang[satuan] && pecahan > 0) {
        totalKembalian -= rumusUang[satuan];
        pecahan -= rumusUang[satuan];
        kondisiUangBaru[1] = Math.round(100 * (kondisiUangBaru[1] + rumusUang[satuan] / 100)) / 100;
      }

      if (kondisiUangBaru[1] > 0) {
        jumlahUangYangDikembalikan.push(kondisiUangBaru);
      }
    });

    // Cek jika uangnya ada, tetapi pecahannya tidak ada
    if (totalKembalian > 0) {
      return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    Changedue.innerHTML = "<p>status: OPEN</p>";
    jumlahUangYangDikembalikan.forEach((uang) => {
      Changedue.innerHTML += `<p>${uang[0]}: $${uang[1]}</p>`;
      cid.forEach((value) => {
        if (value[0] == uang[0]) {
          value[1] = Math.round(100 * (value[1] - uang[1])) / 100;
        }
      });
    });
    changeInDrawer.innerHTML = "<p><strong>Change in drawer:</strong></p>";
    cid.reverse().forEach((uang, index) => (changeInDrawer.innerHTML += `<p>${namaUang[index]}: $${uang[1]}</p>`));
    return { status: "OPEN", change: jumlahUangYangDikembalikan };
  }
}
