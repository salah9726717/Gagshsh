const pages = ["home", "tasks", "invite", "withdrawals"];

// ---------- Shared state: tasks, balance, daily rewards ----------
// Reward credited to the balance for every claimed Telegram task (change as needed).
const TASK_REWARD = 1.5;
const DAILY_REWARD = 1;
// Withdraw rules
const MIN_WITHDRAW = 200;
const REQUIRED_REFERRALS = 10;
// Successful referrals come from the backend: set window.SOPHIA_REFERRALS = <number>.
function getSuccessfulReferrals() {
  const value = Number(window.SOPHIA_REFERRALS);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}
function getWithdrawRules() {
  const referrals = getSuccessfulReferrals();
  const done = claimedTaskCount();
  const balance = getBalance();
  return [
    { text: `${REQUIRED_REFERRALS} successful referrals`, progress: `${Math.min(referrals, REQUIRED_REFERRALS)}/${REQUIRED_REFERRALS}`, met: referrals >= REQUIRED_REFERRALS },
    { text: "Tasks done", progress: `${done}/${TASK_LINKS.length}`, met: TASK_LINKS.length > 0 && done >= TASK_LINKS.length },
    { text: `Min withdraw reached $${MIN_WITHDRAW}`, progress: `${formatMoney(balance)}/$${MIN_WITHDRAW}`, met: balance >= MIN_WITHDRAW }
  ];
}
const TASK_LINKS = [
  "https://t.me/oppalsa",
  "https://t.me/whosmake",
  "https://t.me/greeeensmile",
  "https://t.me/QwillOfficial",
  "https://t.me/RED_POLITIC_Chanel",
  "https://t.me/ROLPA_OFFICIAL",
  "https://t.me/y2yebi",
  "https://t.me/m20movia",
  "https://t.me/walwalbitgiio",
  "https://t.me/kckscb",
  "https://t.me/ZAAFIFILMS",
  "https://t.me/Zmovies12",
  "https://t.me/alibaba4677",
  "https://t.me/rajuubateel12",
  "https://t.me/viner252",
  "https://t.me/CRAZYHOSTINGER",
  "https://t.me/safari52628",
  "https://t.me/vance3686",
  "https://t.me/Mabda_abooks",
  "https://t.me/altamino577",
  "https://t.me/yorin7u8",
  "https://t.me/discord588",
  "https://t.me/coding6788",
  "https://t.me/m454888",
  "https://t.me/hacker373838",
  "https://t.me/OctolCommunity",
  "https://t.me/ourecocommunity",
  "https://t.me/OctolHub",
  "https://t.me/yowpros",
  "https://t.me/hipurplr"
];
const TASK_STORAGE_KEY = "sophia_tasks_state";
const BALANCE_STORAGE_KEY = "sophia_balance";
const DAILY_STORAGE_KEY = "sophia_daily";
const WITHDRAW_STORAGE_KEY = "sophia_withdrawals";
function loadLocalWithdrawals() {
  const list = readStore(WITHDRAW_STORAGE_KEY, []);
  return Array.isArray(list) ? list : [];
}
function formatWithdrawTime(date) {
  const pad = (n) => String(n).padStart(2, "0");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${pad(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()}, ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function readStore(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); } catch (error) { return fallback; }
}
function writeStore(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* ignore */ }
}
function loadTaskState() { return readStore(TASK_STORAGE_KEY, {}) || {}; }
function saveTaskState(state) { writeStore(TASK_STORAGE_KEY, state); }

function getBalance() {
  const value = Number(readStore(BALANCE_STORAGE_KEY, 0));
  return Number.isFinite(value) ? value : 0;
}
function formatMoney(value) {
  const rounded = Math.round(value * 100) / 100;
  return `$${Number.isInteger(rounded) ? rounded : rounded.toFixed(2)}`;
}
// Every reward (tasks, daily) is added to the balance through this function.
function addToBalance(amount) {
  writeStore(BALANCE_STORAGE_KEY, Math.round((getBalance() + amount) * 100) / 100);
  updateSummary();
}
// Withdraw page (MAX) reads the same balance.
Object.defineProperty(window, "SOPHIA_BALANCE", { get: getBalance, set: (v) => writeStore(BALANCE_STORAGE_KEY, Number(v) || 0), configurable: true });

function claimedTaskCount() {
  const state = loadTaskState();
  return TASK_LINKS.filter((_, i) => state[i] === "claimed").length;
}
// Home cards: ACTIVE BALANCE -> $0, ACTIVE TASKS -> total/claimed (e.g. 30/0)
function updateSummary() {
  const balanceNode = document.getElementById("user-balance");
  const tasksNode = document.getElementById("user-tasks");
  if (balanceNode) balanceNode.textContent = formatMoney(getBalance());
  if (tasksNode) tasksNode.textContent = `${TASK_LINKS.length}/${claimedTaskCount()}`;
}

function weekKey(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
  return `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`;
}
function loadDaily() {
  const data = readStore(DAILY_STORAGE_KEY, null);
  return data && data.week === weekKey() ? data : { week: weekKey(), days: [] };
}

const navItems = document.querySelectorAll(".nav-item");

function openPage(page) {
  if (!pages.includes(page)) return;
  document.body.classList.toggle("is-home", page === "home");

  navItems.forEach((item) => {
    const selected = item.dataset.page === page;
    item.classList.toggle("active", selected);

    if (selected) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });

  const pageArea = document.querySelector(".page-area");
  pageArea.dataset.currentPage = page;

  if (page === "home") {
    pageArea.innerHTML = `
      <section class="welcome-card" aria-label="Welcome">
        <h1 class="welcome-card-title">Welcome to Sophia Company</h1>
      </section>
      <section class="account-summary-cards" aria-label="Account summary">
        <article class="summary-card"><span class="summary-label">ACTIVE BALANCE</span><strong class="summary-value" id="user-balance">$0</strong></article>
        <article class="summary-card"><span class="summary-label">ACTIVE TASKS</span><strong class="summary-value" id="user-tasks">0/0</strong></article>
      </section>
      <button type="button" class="withdraw-btn" id="home-withdraw-btn" data-go-page="withdrawals">
        <span>Withdraw</span>
      </button>
      <button type="button" class="invite-promo" id="home-invite-card">
        <span class="invite-promo-label">INVITE &amp; SHARE</span>
        <strong class="invite-promo-title">Invite friends, earn together</strong>
        <span class="invite-promo-desc">Share your personal invite link with friends and earn a reward when your invited friend becomes successful.</span>
      </button>
      <section class="more-info" aria-label="More info">
        <h2 class="more-info-title">More Info</h2>
        <div class="more-info-body">
          <span class="more-info-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M21.5 3.6 2.9 10.8c-.8.3-.8 1.4 0 1.7l4.6 1.6 1.8 5.5c.2.6 1 .8 1.4.3l2.6-2.5 4.7 3.5c.6.4 1.4.1 1.6-.6l3.1-15.1c.2-.9-.7-1.6-1.2-1.1ZM9.2 13.6l8.4-5.2-6.5 6.2-.3 3.2-1.6-4.2Z"/></svg>
          </span>
          <p class="more-info-desc">Join our official Telegram channel to get the latest news, updates and announcements from Sophia Company.</p>
          <button type="button" class="more-info-open" id="home-news-btn">Open</button>
        </div>
      </section>`;
    populateUserCard();
    bindHomeWithdrawButton();
  } else if (page === "tasks") {
    renderTasksPage();
  } else if (page === "invite") {
    renderInvitePage();
  } else if (page === "withdrawals") {
    renderWithdrawPage();
  } else {
    pageArea.innerHTML = "";
  }
}

function bindHomeWithdrawButton() {
  const btn = document.getElementById("home-withdraw-btn");
  if (btn) btn.addEventListener("click", () => openPage("withdrawals"));
  const inviteCard = document.getElementById("home-invite-card");
  if (inviteCard) inviteCard.addEventListener("click", () => openPage("invite"));
  const newsBtn = document.getElementById("home-news-btn");
  if (newsBtn) newsBtn.addEventListener("click", () => {
    const url = "https://t.me/Sophiacompanynews";
    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(url);
    } else {
      window.open(url, "_blank", "noopener");
    }
  });
}
bindHomeWithdrawButton();

navItems.forEach((item) => {
  item.addEventListener("click", () => openPage(item.dataset.page));
});

// Telegram Mini App setup (also works in a normal browser).
if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
}


// Populate the account card from Telegram Mini App data when available.
// No sample account details are inserted when Telegram data is unavailable.
function populateUserCard() {
  updateSummary();
}
populateUserCard();


const INVITE_BASE_LINK = "https://t.me/Sophiacompanybot?startapp";

function getInviteLink() {
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const userId = tgUser?.id;
  // Personal link when the Telegram user is known, otherwise the plain app link.
  if (!userId) return INVITE_BASE_LINK;
  return `${INVITE_BASE_LINK}=${encodeURIComponent(userId)}`;
}

function renderInvitePage() {
  const pageArea = document.querySelector(".page-area");
  const inviteLink = getInviteLink();
  const shownLink = inviteLink || "Open inside Telegram to generate your link";
  pageArea.innerHTML = `
    <div class="invite-page">
      <section class="invite-hero">
        <span class="invite-kicker">
          <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19 8v6M16 11h6"/></svg>
          SOPHIA COMPANY REFERRALS
        </span>
        <h1>Invite friends.<br>Earn together.</h1>
        <p>Share your personal invite link and earn a reward when your invited friend becomes successful.</p>
      </section>

      <section class="invite-link-card">
        <span class="invite-section-label">YOUR PERSONAL INVITE LINK</span>
        <div class="invite-link-row">
          <span class="invite-link-text" id="invite-link-value">${escapeHtml(shownLink)}</span>
          <button class="invite-copy" id="invite-copy-btn" type="button" aria-label="Copy invite link" ${inviteLink ? "" : "disabled"}>
            <svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>
          </button>
        </div>
        <button class="invite-share" id="invite-share-btn" type="button" ${inviteLink ? "" : "disabled"}>
          <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.6 6.6-4.2M8.7 13.4l6.6 4.2"/></svg>
          Share Invite Link
        </button>
      </section>

      <section class="invite-stats" aria-label="Invite statistics">
        <article class="invite-stat">
          <span class="invite-stat-icon"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3.5 20v-1.2a4.5 4.5 0 0 1 4.5-4.5h2a4.5 4.5 0 0 1 4.5 4.5V20M17 8v6M14 11h6"/></svg></span>
          <strong id="invite-count">${Math.max(0, Math.floor(Number(window.SOPHIA_INVITED)) || 0)}</strong><span>INVITED</span>
        </article>
        <article class="invite-stat">
          <span class="invite-stat-icon"><svg viewBox="0 0 24 24"><path d="m5 12 4.2 4.2L19.5 6"/></svg></span>
          <strong id="invite-success-count">${getSuccessfulReferrals()}</strong><span>SUCCESSFUL</span>
        </article>
        <article class="invite-stat">
          <span class="invite-stat-icon"><svg viewBox="0 0 24 24"><path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span>
          <strong id="invite-earned">${formatMoney(getSuccessfulReferrals() * 2)}</strong><span>EARNED</span>
        </article>
      </section>

      <section class="invite-how">
        <h2>How it works</h2>
        <div class="how-step">
          <span class="how-number">01</span>
          <div class="how-copy"><strong>Invite a friend</strong><p>Share your personal link. A user is counted as invited when they open the link and start the Sophia Company app.</p></div>
        </div>
        <div class="how-step">
          <span class="how-number">02</span>
          <div class="how-copy"><strong>They complete all tasks</strong><p>Your invited user becomes successful after completing all tasks.</p></div>
        </div>
        <div class="how-step">
          <span class="how-number">03</span>
          <div class="how-copy"><strong>You earn $2</strong><p>Receive $2 for each successful referral after all their tasks are verified as completed.</p></div>
        </div>
        <div class="invite-reward-note">Only genuine app starts and verified completed tasks count. Referral totals and earned rewards will appear here when connected to the live backend.</div>
      </section>
    </div>`;

  const copyBtn = document.getElementById("invite-copy-btn");
  const shareBtn = document.getElementById("invite-share-btn");
  if (copyBtn && inviteLink) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(inviteLink);
        showInviteToast("Invite link copied");
      } catch {
        showInviteToast("Could not copy link");
      }
    });
  }
  if (shareBtn && inviteLink) {
    shareBtn.addEventListener("click", () => {
      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent("Join me on Sophia Company!")}`;
      if (window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(shareUrl);
      } else {
        window.open(shareUrl, "_blank", "noopener");
      }
    });
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function showInviteToast(message) {
  document.querySelector(".invite-toast")?.remove();
  const toast = document.createElement("div");
  toast.className = "invite-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 1800);
}



function renderTasksPage() {
  const pageArea = document.querySelector(".page-area");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const collectedDays = new Set(loadDaily().days);
  pageArea.innerHTML = `
    <div class="tasks-page">
      <section class="daily-reward-card" aria-label="Daily rewards">
        <div class="daily-reward-top">
          <div class="daily-reward-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 2.8v2.1M12 19.1v2.1M4.7 4.7l1.5 1.5M17.8 17.8l1.5 1.5M2.8 12h2.1M19.1 12h2.1M4.7 19.3l1.5-1.5M17.8 6.2l1.5-1.5"/><circle cx="12" cy="12" r="4.2"/></svg>
          </div>
          <div class="daily-reward-heading"><h1>Daily Rewards</h1><p>Collect your reward every day</p></div>
          <div class="daily-reward-amount"><strong>$1</strong><span>REWARD</span></div>
        </div>
        <div class="daily-days" aria-label="Days of the week">
          ${days.map((day) => {
            const collected = collectedDays.has(day);
            return `<div class="daily-day${collected ? " is-collected" : ""}" aria-label="${day}${collected ? ", reward collected" : ", not collected"}">
              <span class="daily-day-mark"><span class="daily-day-name">${day}</span>${collected ? '<span class="daily-day-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 6.8"/></svg></span>' : ""}</span>
            </div>`;
          }).join("")}
        </div>
        <button class="collect-today-btn" id="collect-today-btn" type="button">
          <span>Collect Today</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.2 4.2L19 6.5"/></svg>
        </button>
      </section>

      <section class="task-list" aria-label="Tasks">
        <div class="task-list-head">
          <h2 class="task-list-title">Tasks</h2>
          <span class="task-reward-tag">Per task reward $${TASK_REWARD}</span>
        </div>
        ${TASK_LINKS.map((url, i) => `
          <article class="task-row" data-task="${i}">
            <span class="task-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M21.5 3.6 2.9 10.8c-.8.3-.8 1.4 0 1.7l4.6 1.6 1.8 5.5c.2.6 1 .8 1.4.3l2.6-2.5 4.7 3.5c.6.4 1.4.1 1.6-.6l3.1-15.1c.2-.9-.7-1.6-1.2-1.1ZM9.2 13.6l8.4-5.2-6.5 6.2-.3 3.2-1.6-4.2Z"/></svg>
            </span>
            <div class="task-info"><strong>Task ${i + 1}</strong><span>Join Telegram channel</span></div>
            <button class="task-btn" type="button"></button>
          </article>`).join("")}
      </section>
    </div>`;

  initTaskList();

  document.getElementById("collect-today-btn")?.addEventListener("click", () => {
    const daily = loadDaily();
    const today = days[new Date().getDay()];
    if (daily.days.includes(today)) {
      showTasksNotice("You already collected today's reward.");
      return;
    }
    daily.days.push(today);
    writeStore(DAILY_STORAGE_KEY, daily);
    addToBalance(DAILY_REWARD);
    showTasksNotice(`${formatMoney(DAILY_REWARD)} added to your balance.`);
    renderTasksPage();
  });
}

function showTasksNotice(message) {
  document.querySelector(".tasks-toast")?.remove();
  const toast = document.createElement("div");
  toast.className = "tasks-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 2600);
}

// ---------- Withdraw page ----------
// Connect your backend by setting these (all optional):
//   window.SOPHIA_BALANCE      -> number, the user's active balance (used by MAX)
//   window.SOPHIA_WITHDRAWALS  -> array of { address, amount, time, status }
//   window.onWithdrawSubmit    -> function({ address, amount }) called by CONFIRM
function renderWithdrawPage() {
  const pageArea = document.querySelector(".page-area");

  pageArea.innerHTML = `
    <div class="withdraw-page">
      <section class="wd-header">
        <h1>Withdraw</h1>
        <p>Send your earnings to your USDT (BEP20) wallet.</p>
      </section>

      <section class="wd-card" aria-label="Withdraw form">
        <label class="wd-label" for="wd-address">USDT BEP20 ADDRESS</label>
        <div class="wd-input-row">
          <input class="wd-input" id="wd-address" type="text" placeholder="0x..." autocomplete="off" autocapitalize="off" spellcheck="false" />
          <button class="wd-mini-btn" id="wd-paste" type="button">PASTE</button>
        </div>

        <label class="wd-label" for="wd-amount">AMOUNT</label>
        <div class="wd-input-row">
          <input class="wd-input" id="wd-amount" type="text" inputmode="decimal" placeholder="0.00" autocomplete="off" />
          <button class="wd-mini-btn" id="wd-max" type="button">MAX</button>
        </div>

        <button class="wd-confirm" id="wd-confirm" type="button">CONFIRM</button>
      </section>

      <section class="wd-card" aria-label="Withdraw rules">
        <h2 class="wd-history-title">Withdraw Rules</h2>
        <ul class="wd-rules">
          ${getWithdrawRules().map((rule, i) => `
            <li class="wd-rule${rule.met ? " is-met" : ""}">
              <span class="wd-rule-num">${rule.met ? "&#10003;" : i + 1}</span>
              <span class="wd-rule-text">${escapeHtml(rule.text)}</span>
              <span class="wd-rule-progress">${escapeHtml(rule.progress)}</span>
            </li>`).join("")}
        </ul>
      </section>
    </div>`;

  const addressInput = document.getElementById("wd-address");
  const amountInput = document.getElementById("wd-amount");


  document.getElementById("wd-paste").addEventListener("click", async () => {
    try {
      const text = (await navigator.clipboard.readText()).trim();
      if (text) addressInput.value = text;
      else showInviteToast("Clipboard is empty");
    } catch (error) {
      showInviteToast("Cannot read clipboard — paste manually");
      addressInput.focus();
    }
  });

  document.getElementById("wd-max").addEventListener("click", () => {
    const balance = Number(window.SOPHIA_BALANCE);
    if (Number.isFinite(balance) && balance > 0) { amountInput.value = String(balance); }
    else showInviteToast("No available balance");
  });

  const confirmBtn = document.getElementById("wd-confirm");
  confirmBtn.addEventListener("click", async () => {
    const address = addressInput.value.trim();
    const amount = Number(amountInput.value.replace(",", "."));
    if (!getWithdrawRules().every((rule) => rule.met)) return showInviteToast("Complete all withdraw rules first");
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return showInviteToast("Enter a valid BEP20 address");
    if (!Number.isFinite(amount) || amount <= 0) return showInviteToast("Enter a valid amount");
    if (amount < MIN_WITHDRAW) return showInviteToast(`Minimum withdraw is $${MIN_WITHDRAW}`);
    const balance = Number(window.SOPHIA_BALANCE);
    if (Number.isFinite(balance) && amount > balance) return showInviteToast("Amount is higher than your balance");
    confirmBtn.disabled = true;
    let accepted = true;
    if (typeof window.onWithdrawSubmit === "function") {
      try { accepted = (await window.onWithdrawSubmit({ address, amount })) !== false; } catch (error) { accepted = false; }
    }
    if (!accepted) {
      confirmBtn.disabled = false;
      return showInviteToast("Withdrawal failed. Please try again.");
    }
    // Record the request in Withdrawal History as Pending and hold the amount.
    const list = loadLocalWithdrawals();
    list.unshift({ address, amount: formatMoney(amount), time: formatWithdrawTime(new Date()), status: "Pending" });
    writeStore(WITHDRAW_STORAGE_KEY, list);
    addToBalance(-amount);
    renderWithdrawPage();
    showWithdrawSuccess(amount);
  });
}


function showWithdrawSuccess(amount) {
  document.querySelector(".wd-modal")?.remove();
  const modal = document.createElement("div");
  modal.className = "wd-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML = `
    <div class="wd-modal-card">
      <div class="wd-modal-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5.5 12.5 4.2 4.2 8.8-9.4"/></svg></div>
      <h3>Withdrawal Submitted</h3>
      <p>You withdrew <strong>${formatMoney(amount)}</strong>.</p>
      <span class="wd-modal-status">Status: Pending</span>
      <button type="button" class="wd-modal-btn">OK</button>
    </div>`;
  const close = () => modal.remove();
  modal.querySelector(".wd-modal-btn").addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  document.body.appendChild(modal);
}


// ---------- Telegram channel tasks ----------
// Optional backend hooks (recommended — verify membership server-side with the bot's getChatMember):
//   window.verifyTask(task) -> Promise<boolean>   task = { id, url }
//   window.onClaimTask(task) -> Promise<boolean>  (optional) server-side credit; return true on success

function initTaskList() {
  const state = loadTaskState();
  const rows = document.querySelectorAll(".task-row");

  const paint = (row, status) => {
    const btn = row.querySelector(".task-btn");
    btn.className = "task-btn";
    btn.disabled = false;
    if (status === "verifying") { btn.textContent = "Verifying..."; btn.disabled = true; btn.classList.add("is-verifying"); }
    else if (status === "ready") { btn.textContent = "Claim"; btn.classList.add("is-claim"); }
    else if (status === "claimed") { btn.textContent = "Claimed"; btn.disabled = true; btn.classList.add("is-claimed"); }
    else { btn.textContent = "Go"; }
  };

  rows.forEach((row) => {
    const id = Number(row.dataset.task);
    const task = { id, url: TASK_LINKS[id] };
    const btn = row.querySelector(".task-btn");
    paint(row, state[id] === "verifying" ? "go" : state[id] || "go");

    btn.addEventListener("click", async () => {
      const current = state[id] || "go";

      if (current === "go") {
        if (window.Telegram?.WebApp?.openTelegramLink) window.Telegram.WebApp.openTelegramLink(task.url);
        else window.open(task.url, "_blank", "noopener");
        paint(row, "verifying");
        let ok = true;
        try {
          ok = typeof window.verifyTask === "function"
            ? await window.verifyTask(task)
            : await new Promise((resolve) => setTimeout(() => resolve(true), 6000));
        } catch (error) { ok = false; }
        if (ok) { state[id] = "ready"; saveTaskState(state); paint(row, "ready"); }
        else { paint(row, "go"); showTasksNotice("Join the channel first, then try again."); }
        return;
      }

      if (current === "ready") {
        btn.disabled = true;
        let credited = true;
        if (typeof window.onClaimTask === "function") {
          try { credited = await window.onClaimTask(task); } catch (error) { credited = false; }
        }
        if (credited) {
          state[id] = "claimed";
          saveTaskState(state);
          paint(row, "claimed");
          addToBalance(TASK_REWARD);
          showTasksNotice(`${formatMoney(TASK_REWARD)} added to your balance.`);
        } else {
          paint(row, "ready");
          showTasksNotice("Could not claim. Please try again.");
        }
      }
    });
  });
}
