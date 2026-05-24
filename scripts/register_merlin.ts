// Script: register_merlin.ts
// Purpose: simulate the `Hesap Oluştur` flow by fetching /login,
// extracting CSRF, then POSTing the registration form for `merlin`.

const base = "http://127.0.0.1:8000";
const username = "merlin";
const password = "merlin123";

console.log(`Fetching ${base}/login to obtain CSRF token and cookie`);
const getRes = await fetch(`${base}/login`);
if (!getRes.ok) {
  console.error("GET /login failed with status", getRes.status);
  Deno.exit(1);
}

const setCookieHeader = getRes.headers.get("set-cookie") || "";
const cookieMatch = setCookieHeader.match(/csrf_token=([^;]+)/);
const csrfCookie = cookieMatch ? cookieMatch[1] : null;

const body = await getRes.text();
const csrfMatch = body.match(/name="_csrf" value="([^"]+)"/);
const csrfForm = csrfMatch ? csrfMatch[1] : null;

console.log("csrf cookie:", csrfCookie);
console.log("csrf form:", csrfForm);

if (!csrfCookie || !csrfForm) {
  console.error("Could not get CSRF cookie or form token");
  Deno.exit(1);
}

// Build form data
const params = new URLSearchParams();
params.set("action", "register");
params.set("username", username);
params.set("password", password);
params.set("_csrf", csrfForm);

console.log("Submitting registration form (simulating 'Hesap Oluştur')");
const postRes = await fetch(`${base}/login`, {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Cookie: `csrf_token=${csrfCookie}`,
  },
  body: params.toString(),
  redirect: "manual",
});

console.log("POST /login returned status", postRes.status);

if (postRes.status === 303) {
  console.log(
    "Registration succeeded (server redirected). Location:",
    postRes.headers.get("location"),
  );
  Deno.exit(0);
}

const postBody = await postRes.text();

if (postBody.includes("Bu kullanıcı adı zaten sistemde kayıtlı")) {
  console.log(
    "Registration failed: username already exists. Will try to login instead.",
  );

  // Try login flow
  const getRes2 = await fetch(`${base}/login`);
  const setCookie2 = getRes2.headers.get("set-cookie") || "";
  const csrfCookie2 = (setCookie2.match(/csrf_token=([^;]+)/) || [])[1];
  const body2 = await getRes2.text();
  const csrfForm2 = (body2.match(/name="_csrf" value="([^"]+)"/) || [])[1];

  if (!csrfCookie2 || !csrfForm2) {
    console.error("Cannot obtain CSRF for login attempt");
    Deno.exit(1);
  }

  const loginParams = new URLSearchParams();
  loginParams.set("action", "login");
  loginParams.set("username", username);
  loginParams.set("password", password);
  loginParams.set("_csrf", csrfForm2);

  const loginRes = await fetch(`${base}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: `csrf_token=${csrfCookie2}`,
    },
    body: loginParams.toString(),
    redirect: "manual",
  });

  console.log("Login attempt status:", loginRes.status);
  if (loginRes.status === 303) {
    console.log("Login successful for user", username);
    Deno.exit(0);
  }

  const loginBody = await loginRes.text();
  // Print full response body for debugging (server-side message)
  console.log("Login response body:\n", loginBody);
  if (loginBody.includes("Şifre hatalı")) {
    console.log("Login failed: incorrect password for user", username);
  } else if (loginBody.includes("Güvenlik doğrulaması başarısız")) {
    console.log("Login failed: CSRF validation failed");
  } else {
    console.log("Login failed; response snippet:\n", loginBody.slice(0, 300));
  }

  Deno.exit(1);
}

// Other errors
console.log(
  "Registration did not redirect and did not return a known error. Response snippet:\n",
  postBody.slice(0, 400),
);
Deno.exit(1);
