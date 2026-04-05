/* =======================
   GOOGLE SHEETS WEB APP
   ======================= */
const SHEETS_WEBAPP_URL =
"https://script.google.com/macros/s/AKfycbxKH4W9lfmNaqpi48uLE41PLpRPqRT4PVztiHjBakDRoZ8Yv-ZAEuokOupEUspDVwdQ/exec";

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1490404575017041970/-Aj5sjeSv6LTfxm4ewYIBY3Z5JGy-srjCmuPpE7GMaxWN55Vv5Yuscy94vqe2tn6apgm";

/* =======================
   DATA ITEM (WEAPON RP)
   ======================= */
const items = [
  {
    id: "w1",
    name: "Pistol .50",
    price: 10000,
    tag: "class1",
    imageUrl: "assets/weapons/weapon_pistol50.png"
  },
  {
    id: "w2",
    name: "Ammo-50 (x20)",
    price: 1300,
    tag: "ammo",
    imageUrl: "assets/ammo/ammo-50.png"
  },
  {
    id: "w3",
    name: "Vest Biru",
    price: 2600,
    tag: "guard",
    imageUrl: "assets/vest/Biru.png"
  },
    {
    id: "w3",
    name: "Vest Merah",
    price: 1300,
    tag: "guard",
    imageUrl: "assets/vest/Merah.png"
  },
  {
    id: "w4",
    name: "Micro SMG",
    price: 30000,
    tag: "class2",
    imageUrl: "assets/weapons/weapon_microsmg.png"
  },
  {
    id: "w8",
    name: "ammo 9mm (x40)",
    price: 2600,
    tag: "ammo",
    imageUrl: "assets/ammo/ammo-9.png"
  },
  {
    id: "w9",
    name: "Ceramic Pistol",
    price: 26000,
    tag: "class1",
    imageUrl: "assets/weapons/weapon_ceramicpistol.png"
  },
  {
    id: "w10",
    name: "X17 / Glock",
    price: 32500,
    tag: "class1",
    imageUrl: "assets/weapons/weapon_pistolxm3.png"
  },
  {
    id: "w11",
    name: "Machine Pistol",
    price: 26000,
    tag: "class1",
    imageUrl: "assets/weapons/weapon_machinepistol.png"
  },
  {
    id: "w12",
    name: "Mini SMG",
    price: 30000,
    tag: "class2",
    imageUrl: "assets/weapons/weapon_minismg.png"
  },
  {
    id: "w13",
    name: "SMG",
    price: 39000,
    tag: "class2",
    imageUrl: "assets/weapons/weapon_smg.png"
  },
  {
    id: "w14",
    name: "Navy Revolver",
    price: 71500,
    tag: "class2",
    imageUrl: "assets/weapons/weapon_navyrevolver.png"
  },
  {
    id: "w15",
    name: "KVR",
    price: 78000,
    tag: "class2",
    imageUrl: "assets/weapons/weapon_kvr.png"
  },
  {
    id: "w16",
    name: "Virtus",
    price: 227500,
    tag: "class3",
    imageUrl: "assets/weapons/weapon_carbinerifle_mk2.png"
  },
  {
    id: "w17",
    name: "Assault Rifle",
    price: 195000,
    tag: "class3",
    imageUrl: "assets/weapons/weapon_assaultrifle.png"
  },
  {
    id: "w19",
    name: "Pump Shotgun",
    price: 50000,
    tag: "class3",
    imageUrl: "assets/weapons/weapon_pumpshotgun.png"
  },
  {
    id: "w20",
    name: "Black Revolver",
    price: 91000,
    tag: "class3",
    imageUrl: "assets/weapons/weapon_revolver.png"
  },
  {
    id: "w21",
    name: "Ammo-44",
    price: 5000,
    tag: "ammo",
    imageUrl: "assets/ammo/ammo-44.png"
  },
  {
    id: "w22",
    name: "Ammo-45",
    price: 5000,
    tag: "ammo",
    imageUrl: "assets/ammo/ammo-45.png"
  },
  {
    id: "w23",
    name: "Ammo-AR",
    price: 5000,
    tag: "ammo",
    imageUrl: "assets/ammo/ammo-rifle2.png"
  },
    {
    id: "w23",
    name: "Ammo-Virtus",
    price: 5000,
    tag: "ammo",
    imageUrl: "assets/ammo/ammo-rifle.png"
  },
  {
    id: "w24",
    name: "Ammo-Shotgun",
    price: 5000,
    tag: "ammo",
    imageUrl: "assets/ammo/ammo-shotgun.png"
  },
];

/* =======================
   STATE
   ======================= */
const qty = new Map();
let filter = "all";
let posMode = false;

/* =======================
   ELEMENT
   ======================= */
const grid = document.getElementById("grid");
const totalQtyEl = document.getElementById("totalQty");
const totalPriceEl = document.getElementById("totalPrice");

const memberInput = document.getElementById("memberInput");
const memberKpi = document.getElementById("memberKpi");
const memberBadge = document.getElementById("memberBadge");

const posToggle = document.getElementById("posToggle");
const cashierPanel = document.getElementById("cashierPanel");
const cart = document.getElementById("cart");
const posQty = document.getElementById("posQty");
const posTotal = document.getElementById("posTotal");

const cashInput = document.getElementById("cashInput");
const payBtn = document.getElementById("payBtn");
const resetBtn = document.getElementById("resetBtn");
const posNote = document.getElementById("posNote");
const nameScreen = document.getElementById("nameScreen");
const startNameInput = document.getElementById("startNameInput");
const startBtn = document.getElementById("startBtn");

/* =======================
   HELPER
   ======================= */
function dollar(n){
  return `$ ${n.toLocaleString("en-US")}`;
}

function getQty(id){
  return qty.get(id) || 0;
}

function setQty(id, val){
  const v = Math.max(0, val);
  if(v === 0) qty.delete(id);
  else qty.set(id, v);
}

function calcTotals(){
  let tQty = 0;
  let tPrice = 0;

  for(const it of items){
    const q = getQty(it.id);
    if(q > 0){
      tQty += q;
      tPrice += q * it.price;
    }
  }
  return { tQty, tPrice };
}

function itemVisible(it){
  return filter === "all" || it.tag === filter;
}

/* =======================
   AUTO POS
   ======================= */
function syncAutoPOS(){
  const { tQty } = calcTotals();

  if(tQty > 0 && !posMode){
    posMode = true;
    cashierPanel.classList.add("open");
    posToggle.textContent = "Mode Kasir: ON";
  }

  if(tQty === 0 && posMode){
    posMode = false;
    cashierPanel.classList.remove("open");
    posToggle.textContent = "Cashier mode : OFF";
  }
}

/* =======================
   RENDER GRID
   ======================= */
function renderGrid(){
  grid.innerHTML = "";

  for(const it of items){
    if(!itemVisible(it)) continue;

    const q = getQty(it.id);
    const sub = q * it.price;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="thumb"><img src="${it.imageUrl}"></div>
      <div class="meta-col">
        <h3>${it.name}</h3>
        <div class="price">${dollar(it.price)} • ${it.tag}</div>
        <div class="qty">
          <button class="minus">-</button>
          <span>${q}</span>
          <button class="plus">+</button>
        </div>
        <div class="line-total">Subtotal: <strong>${dollar(sub)}</strong></div>
      </div>
    `;

    card.querySelector(".minus").onclick = () => {
      setQty(it.id, q - 1);
      renderAll();
    };

    card.querySelector(".plus").onclick = () => {
      setQty(it.id, q + 1);
      renderAll();
    };

    grid.appendChild(card);
  }
}

/* =======================
   RENDER SUMMARY
   ======================= */
function renderSummary(){
  const { tQty, tPrice } = calcTotals();

  totalQtyEl.textContent = tQty;
  totalPriceEl.textContent = dollar(tPrice);
  posQty.textContent = tQty;
  posTotal.textContent = dollar(tPrice);
  cashInput.value = tPrice;

  if(!posMode) return;

  const selected = items.filter(it => getQty(it.id) > 0);
  cart.innerHTML = selected.length ? "" : `<div class="small">Belum ada item.</div>`;

  for(const it of selected){
    const q = getQty(it.id);
    const sub = q * it.price;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-left">
        <div class="name">${it.name}</div>
      </div>
      <div class="right">
        <strong>${dollar(sub)}</strong>
        <div class="small" data-id="${it.id}" style="cursor:pointer">Hapus</div>
      </div>
    `;
    row.querySelector("[data-id]").onclick = () => {
      qty.delete(it.id);
      renderAll();
    };
    cart.appendChild(row);
  }
}

function renderAll(){
  syncAutoPOS();
  renderGrid();
  renderSummary();
}

/* =======================
   FILTER
   ======================= */
document.getElementById("specialMenu").onclick = e => {
  const el = e.target.closest(".special-item");
  if(!el) return;
  filter = el.dataset.filter;
  document.querySelectorAll(".special-item").forEach(x => x.classList.remove("active"));
  el.classList.add("active");
  renderAll();
};

/* =======================
   MEMBER
   ======================= */
memberInput.oninput = () => {
  memberKpi.textContent = memberInput.value || "Member 30s fams";
  memberBadge.textContent = memberInput.value || "Member";
};

/* =======================
   RESET
   ======================= */
resetBtn.onclick = () => {
  qty.clear();
  cashInput.value = "";
  posNote.textContent = "";
  renderAll();
};

/* =======================
   SEND TO SHEETS
   ======================= */
async function sendOrderToSheets(payload){
  const res = await fetch(SHEETS_WEBAPP_URL,{
    method:"POST",
    headers:{ "Content-Type":"text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });
  if(!res.ok) throw new Error("Failed");
}

/* =======================
   SEND TO DISCORD
   ======================= */
async function sendToDiscord(payload){
  const message = {
    content: `🧾 **ORDER BARU MASUK**
    
👤 Customer: ${payload.member}
📦 Item: ${payload.items}
📊 Qty: ${payload.totalQty}
💰 Total: ${payload.totalPrice}
⏰ Waktu: ${payload.time}
    `
  };

  await fetch(DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  });
}

/* =======================
   PAY
   ======================= */
payBtn.onclick = async () => {
  const { tQty, tPrice } = calcTotals();
  const cash = Number(cashInput.value || 0);
  const memberName = memberInput.value.trim();

  // ❗ VALIDASI NAMA
  if (!memberName) {
    posNote.textContent = "Drop your name before anything else!";
    return;
  }

  // validasi item
  if(tQty === 0){
    posNote.textContent = "No item selected.";
    return;
  }

  // validasi uang
  if(cash < tPrice){
    posNote.textContent = "Not enough cash.";
    return;
  }

  const simpleItems = items
    .filter(it => getQty(it.id) > 0)
    .map(it => `${it.name} (x${getQty(it.id)})`)
    .join(", ");

  const payload = {
    time: new Date().toLocaleString("en-US"),
    category: "Weapon Resource RP",
    member: memberName, // 🔥 pakai yang sudah divalidasi
    totalQty: tQty,
    totalPrice: `$ ${tPrice}`,
    cash: `$ ${cash}`,
    change: `$ ${cash - tPrice}`,
    items: simpleItems
  };

  try{
    posNote.textContent = "Sending...";
    await sendOrderToSheets(payload);
    await sendToDiscord(payload); // 🔥 kirim ke discord
    posNote.textContent = "Transaction success ✅";
    qty.clear();
    cashInput.value = "";
    renderAll();
  }catch{
    posNote.textContent = "Send failed ❌";
  }
};

/* =======================
   INIT
   ======================= */
renderAll();
