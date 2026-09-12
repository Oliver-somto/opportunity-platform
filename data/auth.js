import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {

  apiKey:
    "AIzaSyCRIEcDdh0LW9bTqKUAQPsVlXRtXBQp1XM",

  authDomain:
    "scholarship-67c55.firebaseapp.com",

  projectId:
    "scholarship-67c55",

  storageBucket:
    "scholarship-67c55.firebasestorage.app",

  messagingSenderId:
    "41151198736",

  appId:
    "1:41151198736:web:e99187f6d095c1ce933c95",

  measurementId:
    "G-GM915G194Y"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const googleProvider =
  new GoogleAuthProvider();

const signupForm =
  document.getElementById("signup-form");

const signinForm =
  document.getElementById("signin-form");

const forgotPasswordForm =
  document.getElementById(
    "forgot-password-form"
  );

const signupSwitch =
  document.getElementById(
    "signup-switch"
  );

const signinSwitch =
  document.getElementById(
    "signin-switch"
  );

const showSignin =
  document.getElementById(
    "show-signin"
  );

const showSignup =
  document.getElementById(
    "show-signup"
  );

const forgotPassword =
  document.getElementById(
    "forgot-password"
  );

const backToSignin =
  document.getElementById(
    "back-to-signin"
  );

const authMessage =
  document.getElementById(
    "auth-message"
  );

const googleAuth =
  document.getElementById(
    "google-auth"
  );

const linkedinAuth =
  document.getElementById(
    "linkedin-auth"
  );

function showMessage(
  message,
  type = "error"
) {

  if (!authMessage) return;

  authMessage.textContent = message;

  authMessage.className =
    "auth-message auth-message-" + type;

}


function clearMessage() {

  if (!authMessage) return;

  authMessage.textContent = "";

  authMessage.className =
    "auth-message";

}

function showSignupForm() {

  clearMessage();

  if (signupForm)
    signupForm.hidden = false;

  if (signinForm)
    signinForm.hidden = true;

  if (forgotPasswordForm)
    forgotPasswordForm.hidden = true;

  if (signupSwitch)
    signupSwitch.hidden = false;

  if (signinSwitch)
    signinSwitch.hidden = true;

}


function showSigninForm() {

  clearMessage();

  if (signupForm)
    signupForm.hidden = true;

  if (signinForm)
    signinForm.hidden = false;

  if (forgotPasswordForm)
    forgotPasswordForm.hidden = true;

  if (signupSwitch)
    signupSwitch.hidden = true;

  if (signinSwitch)
    signinSwitch.hidden = false;

}


function showForgotPasswordForm() {

  clearMessage();

  if (signupForm)
    signupForm.hidden = true;

  if (signinForm)
    signinForm.hidden = true;

  if (forgotPasswordForm)
    forgotPasswordForm.hidden = false;

  if (signupSwitch)
    signupSwitch.hidden = true;

  if (signinSwitch)
    signinSwitch.hidden = true;

}

if (showSignin) {

  showSignin.addEventListener(
    "click",
    showSigninForm
  );

}


if (showSignup) {

  showSignup.addEventListener(
    "click",
    showSignupForm
  );

}


if (forgotPassword) {

  forgotPassword.addEventListener(
    "click",
    showForgotPasswordForm
  );

}


if (backToSignin) {

  backToSignin.addEventListener(
    "click",
    showSigninForm
  );

}

function setupPasswordToggle(
  inputId,
  toggleId
) {

  const input =
    document.getElementById(inputId);

  const toggle =
    document.getElementById(toggleId);

  if (!input || !toggle) return;


  toggle.addEventListener(
    "click",
    function () {

      if (
        input.type === "password"
      ) {

        input.type = "text";

        toggle.textContent = "Hide";

        toggle.setAttribute(
          "aria-label",
          "Hide password"
        );

      } else {

        input.type = "password";

        toggle.textContent = "Show";

        toggle.setAttribute(
          "aria-label",
          "Show password"
        );

      }

    }
  );

}


setupPasswordToggle(
  "signup-password",
  "signup-password-toggle"
);

setupPasswordToggle(
  "signup-confirm-password",
  "signup-confirm-password-toggle"
);

setupPasswordToggle(
  "signin-password",
  "signin-password-toggle"
);

function isValidEmail(email) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email);

}

function isValidPassword(password) {

  return password.length >= 8;

}

function markInputError(input) {

  if (!input) return;

  input.classList.add(
    "input-error"
  );

}


function clearInputError(input) {

  if (!input) return;

  input.classList.remove(
    "input-error"
  );

}

async function createUserDocument(
  user,
  additionalData = {}
) {

  try {

    await setDoc(
      doc(db, "users", user.uid),
      {

        uid: user.uid,

        name:
          additionalData.name ||
          user.displayName ||
          "",

        email:
          user.email || "",

        photoURL:
          user.photoURL || "",

        provider:
          additionalData.provider ||
          "password",

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp()

      },
      {
        merge: true
      }
    );

  } catch (error) {

    console.error(
      "Firestore error:",
      error
    );

    throw error;

  }

}

if (signupForm) {

  signupForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();

      clearMessage();


      const name =
        document.getElementById(
          "signup-name"
        );

      const email =
        document.getElementById(
          "signup-email"
        );

      const password =
        document.getElementById(
          "signup-password"
        );

      const confirmPassword =
        document.getElementById(
          "signup-confirm-password"
        );

      const terms =
        document.getElementById(
          "terms"
        );


      clearInputError(name);
      clearInputError(email);
      clearInputError(password);
      clearInputError(
        confirmPassword
      );

      if (!name.value.trim()) {

        markInputError(name);

        showMessage(
          "Please enter your full name."
        );

        name.focus();

        return;

      }

      const cleanEmail =
        email.value.trim();

      if (!isValidEmail(cleanEmail)) {

        markInputError(email);

        showMessage(
          "Please enter a valid email address."
        );

        email.focus();

        return;

      }

      if (
        !isValidPassword(
          password.value
        )
      ) {

        markInputError(password);

        showMessage(
          "Password must be at least 8 characters long."
        );

        password.focus();

        return;

      }

      if (
        password.value !==
        confirmPassword.value
      ) {

        markInputError(
          confirmPassword
        );

        showMessage(
          "Passwords do not match."
        );

        confirmPassword.focus();

        return;

      }

      if (!terms.checked) {

        showMessage(
          "Please agree to the Terms of Use and Privacy Policy."
        );

        terms.focus();

        return;

      }

      const submitButton =
        document.getElementById(
          "signup-submit"
        );

      const originalText =
        submitButton.textContent;

      submitButton.disabled = true;

      submitButton.textContent =
        "Creating Account...";


      try {

        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            cleanEmail,
            password.value
          );


        const user =
          userCredential.user;

        await updateProfile(
          user,
          {
            displayName:
              name.value.trim()
          }
        );

        await createUserDocument(
          user,
          {
            name:
              name.value.trim(),

            provider:
              "password"
          }
        );


        showMessage(
          "Account created successfully!",
          "success"
        );

        setTimeout(
          function () {

            window.location.href =
              "index.html";

          },
          1200
        );


      } catch (error) {

        console.error(
          "Sign up error:",
          error
        );


        let message =
          "Unable to create your account.";


        switch (error.code) {

          case
            "auth/email-already-in-use":

            message =
              "An account with this email already exists.";

            break;


          case
            "auth/invalid-email":

            message =
              "Please enter a valid email address.";

            break;


          case
            "auth/weak-password":

            message =
              "Your password is too weak.";

            break;


          case
            "auth/operation-not-allowed":

            message =
              "Email and password authentication is not enabled in Firebase.";

            break;


          case
            "auth/api-key-not-valid":

            message =
              "The Firebase API key is invalid or restricted.";

            break;


          case
            "auth/network-request-failed":

            message =
              "Network error. Please check your internet connection.";

            break;


          default:

            message =
              error.message ||
              message;

        }


        showMessage(message);


      } finally {

        submitButton.disabled =
          false;

        submitButton.textContent =
          originalText;

      }

    }
  );

}

if (signinForm) {

  signinForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();

      clearMessage();


      const email =
        document.getElementById(
          "signin-email"
        );

      const password =
        document.getElementById(
          "signin-password"
        );


      clearInputError(email);
      clearInputError(password);


      const cleanEmail =
        email.value.trim();

      if (
        !isValidEmail(
          cleanEmail
        )
      ) {

        markInputError(email);

        showMessage(
          "Please enter a valid email address."
        );

        email.focus();

        return;

      }

      if (!password.value) {

        markInputError(password);

        showMessage(
          "Please enter your password."
        );

        password.focus();

        return;

      }


      const submitButton =
        document.getElementById(
          "signin-submit"
        );

      const originalText =
        submitButton.textContent;


      submitButton.disabled = true;

      submitButton.textContent =
        "Signing In...";


      try {

        const userCredential =
          await signInWithEmailAndPassword(
            auth,
            cleanEmail,
            password.value
          );


        const user =
          userCredential.user;

        await createUserDocument(
          user,
          {
            provider:
              "password"
          }
        );


        showMessage(
          "Signed in successfully!",
          "success"
        );


        setTimeout(
          function () {

            window.location.href =
              "index.html";

          },
          1000
        );


      } catch (error) {

        console.error(
          "Sign in error:",
          error
        );


        let message =
          "Unable to sign in.";


        switch (error.code) {

          case
            "auth/invalid-credential":

            message =
              "Incorrect email or password.";

            break;


          case
            "auth/wrong-password":

            message =
              "Incorrect email or password.";

            break;


          case
            "auth/user-not-found":

            message =
              "No account was found with this email.";

            break;


          case
            "auth/invalid-email":

            message =
              "Please enter a valid email address.";

            break;


          case
            "auth/user-disabled":

            message =
              "This account has been disabled.";

            break;


          case
            "auth/network-request-failed":

            message =
              "Network error. Please check your internet connection.";

            break;


          case
            "auth/api-key-not-valid":

            message =
              "The Firebase API key is invalid or restricted.";

            break;


          default:

            message =
              error.message ||
              message;

        }


        showMessage(message);


      } finally {

        submitButton.disabled =
          false;

        submitButton.textContent =
          originalText;

      }

    }
  );

}

if (forgotPasswordForm) {

  forgotPasswordForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();

      clearMessage();


      const email =
        document.getElementById(
          "reset-email"
        );


      clearInputError(email);


      const cleanEmail =
        email.value.trim();


      if (
        !isValidEmail(
          cleanEmail
        )
      ) {

        markInputError(email);

        showMessage(
          "Please enter a valid email address."
        );

        email.focus();

        return;

      }


      const submitButton =
        document.getElementById(
          "reset-submit"
        );

      const originalText =
        submitButton.textContent;


      submitButton.disabled = true;

      submitButton.textContent =
        "Sending...";


      try {

        await sendPasswordResetEmail(
          auth,
          cleanEmail
        );


        showMessage(
          "Password reset link sent. Check your email.",
          "success"
        );


      } catch (error) {

        console.error(
          "Password reset error:",
          error
        );


        let message =
          "Unable to send password reset email.";


        switch (error.code) {

          case
            "auth/user-not-found":

            message =
              "No account was found with this email.";

            break;


          case
            "auth/invalid-email":

            message =
              "Please enter a valid email address.";

            break;


          case
            "auth/network-request-failed":

            message =
              "Network error. Please check your internet connection.";

            break;


          default:

            message =
              error.message ||
              message;

        }


        showMessage(message);

      } finally {

        submitButton.disabled =
          false;

        submitButton.textContent =
          originalText;

      }

    }
  );

}

if (googleAuth) {

  googleAuth.addEventListener(
    "click",
    async function () {

      clearMessage();

      googleAuth.disabled = true;

      googleAuth.textContent =
        "Connecting...";

      try {

        await signInWithRedirect(
          auth,
          googleProvider
        );

      } catch (error) {

        console.error(
          "Google authentication error:",
          error
        );

        googleAuth.disabled = false;

        googleAuth.textContent =
          "Continue with Google";


        let message =
          "Unable to sign in with Google.";


        switch (error.code) {

          case "auth/unauthorized-domain":

            message =
              "This website domain is not authorized in Firebase.";

            break;


          case "auth/network-request-failed":

            message =
              "Network error. Please check your internet connection.";

            break;


          default:

            message =
              error.message ||
              message;

        }


        showMessage(message);

      }

    }

  );

}

getRedirectResult(auth)

  .then(async (result) => {

    if (!result) {
      return;
    }


    const user =
      result.user;


    console.log(
      "Google authentication successful:",
      user.uid
    );


    try {

      await createUserDocument(
        user,
        {
          name:
            user.displayName || "",

          provider:
            "google"
        }
      );


      showMessage(
        "Google sign in successful!",
        "success"
      );


      setTimeout(
        function () {

          window.location.href =
            "index.html";

        },
        1000
      );


    } catch (error) {

      console.error(
        "Google user document error:",
        error
      );


      showMessage(
        "Authentication succeeded, but we couldn't save your user profile. Please try again."
      );

    }

  })

  .catch((error) => {

    console.error(
      "Google redirect authentication error:",
      error
    );


    let message =
      "Google authentication failed.";


    switch (error.code) {

      case "auth/account-exists-with-different-credential":

        message =
          "An account already exists with this email using another sign-in method.";

        break;


      case "auth/unauthorized-domain":

        message =
          "This website domain is not authorized in Firebase.";

        break;


      case "auth/network-request-failed":

        message =
          "Network error. Please check your internet connection.";

        break;


      default:

        message =
          error.message ||
          message;

    }


    showMessage(message);

  });

if (linkedinAuth) {

  linkedinAuth.addEventListener(
    "click",
    function () {

      clearMessage();


      showMessage(
        "LinkedIn authentication requires a separate OAuth/OpenID Connect setup and is not connected yet."
      );

    }
  );

}

const allInputs =
  document.querySelectorAll(
    ".auth-form input"
  );


allInputs.forEach(
  function (input) {

    input.addEventListener(
      "input",
      function () {

        clearInputError(input);


        if (
          authMessage &&
          authMessage.classList.contains(
            "auth-message-error"
          )
        ) {

          clearMessage();

        }

      }
    );

  }
);


onAuthStateChanged(
  auth,
  function (user) {

    if (user) {

      console.log(
        "Authenticated user:",
        user.uid
      );
      
      localStorage.setItem('Authenticated user',
        user.uid);
      localStorage.setItem("logInTime", Date.now())

    } else {

      console.log(
        "No authenticated user."
      );

    }

  }
);


showSignupForm();