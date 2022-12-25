import { auth, db } from "../lib/firebase";
import { getBrowserId } from "../lib/browser";
import browser from "webextension-polyfill";
import { doc, setDoc } from "firebase/firestore";

export {};

// TODO: WRAP EVERYTHING IT TRY CATCH!!!!
try {
  // Your web app's Firebase configuration

  /** Fired when the extension is first installed,
   *  when the extension is updated to a new version,
   *  and when Chrome is updated to a new version. */
  browser.runtime.onInstalled.addListener((details) => {
    console.log("[background.js] onInstalled", details);
    saveTabs();
  });

  // browser.runtime.onConnect.addListener((port) => {
  //   console.log("[background.js] onConnect", port);
  // });

  // chrome.runtime.onStartup.addListener(() => {
  //   console.log("[background.js] onStartup");
  // });

  /**
   *  Sent to the event page just before it is unloaded.
   *  This gives the extension opportunity to do some clean up.
   *  Note that since the page is unloading,
   *  any asynchronous operations started while handling this event
   *  are not guaranteed to complete.
   *  If more activity for the event page occurs before it gets
   *  unloaded the onSuspendCanceled event will
   *  be sent and the page won't be unloaded. */
  // chrome.runtime.onSuspend.addListener(() => {
  //   console.log("[background.js] onSuspend");
  // });

  browser.action.onClicked.addListener(async function () {
    console.log("[background.js] onclicked");
    await browser.tabs.create({
      url: browser.runtime.getURL("index.html"),
    });
    saveTabs();
  });

  browser.tabs.onRemoved.addListener(
    async (tabId: number, removeInfo: object) => {
      console.log("removed", tabId, removeInfo);
      saveTabs();
    }
  );

  browser.tabs.onUpdated.addListener(
    async (
      tabId: number,
      changeInfo: { status?: string },
      tab: browser.Tabs.Tab
    ) => {
      if (changeInfo.status === "complete") {
        console.log("Tab loaded: ", tab.url);
        saveTabs();
      }
    }
  );

  // browser.runtime.onMessage.addListener((msg, sender) => {
  //   console.log("got message", msg);
  //   if (msg.command == "user-auth") {
  //     auth.onAuthStateChanged(function (user) {
  //       if (user) {
  //         // User is signed in.
  //         //browser.storage.local.set({ authInfo: user });
  //         // firebase
  //         //   .database()
  //         //   .ref("/users/" + user.uid)
  //         //   .once("value")
  //         //   .then(function (snapshot) {
  //         //     console.log(snapshot.val());
  //         //     resp({
  //         //       type: "result",
  //         //       status: "success",
  //         //       data: user,
  //         //       userObj: snapshot.val(),
  //         //     });
  //         //   })
  //         //   .catch((result) => {
  //         //     chrome.storage.local.set({ authInfo: false });
  //         //     resp({ type: "result", status: "error", data: false });
  //         //   });
  //         //resp({ type: "result", status: "error", data: false });
  //       } else {
  //         // No user is signed in.
  //         //browser.storage.local.set({ authInfo: false });
  //         // return Promise.resolve({
  //         //   type: "result",
  //         //   status: "error",
  //         //   data: false,
  //         // });
  //       }
  //     });
  //   }

  //   //Auth
  //   //logout
  //   if (msg.command == "auth-logout") {
  //     auth.signOut().then(
  //       function () {
  //         //user logged out...
  //         //browser.storage.local.set({ authInfo: false });
  //         //resp({ type: "result", status: "success", data: false });
  //       },
  //       function (error) {
  //         //logout error....
  //         // resp({
  //         //   type: "result",
  //         //   status: "error",
  //         //   data: false,
  //         //   message: error,
  //         // });
  //       }
  //     );
  //   }
  //   //Login
  //   if (msg.command == "auth-login") {
  //     //login user
  //     signInWithEmailAndPassword(auth, msg.e, msg.p).catch(function (error) {
  //       if (error) {
  //         console.log("Login error:", error);
  //         //return error msg...
  //         //browser.storage.local.set({ authInfo: false });
  //         return Promise.resolve({ error: error });
  //         //resp({ type: "result", status: "error", data: false });
  //       }
  //     });
  //     console.log("auth was successful");
  //     auth.onAuthStateChanged(function (user) {
  //       if (user) {
  //         //return success user objct...
  //         console.log("user login", user);
  //         //browser.storage.local.set({ authInfo: user });
  //         //resp({ type: "result", status: "OK", data: false });
  //         // firebase
  //         //   .database()
  //         //   .ref("/users/" + user.uid)
  //         //   .once("value")
  //         //   .then(function (snapshot) {
  //         //     resp({
  //         //       type: "result",
  //         //       status: "success",
  //         //       data: user,
  //         //       userObj: snapshot.val(),
  //         //     });
  //         //   })
  //         //   .catch((result) => {
  //         //     chrome.storage.local.set({ authInfo: false });
  //         //     resp({ type: "result", status: "error", data: false });
  //         //   });
  //       }
  //     });
  //   }
  //   //Sign Up
  //   if (msg.command == "auth-signup") {
  //     //create user
  //     ///get user id
  //     //make call to lambda
  //     browser.storage.local.set({ authInfo: false });
  //     auth.signOut();
  //     createUserWithEmailAndPassword(auth, msg.e, msg.p).catch(function (
  //       error
  //     ) {
  //       // Handle Errors here.
  //       //browser.storage.local.set({ authInfo: false }); // clear any current session
  //       var errorCode = error.code;
  //       var errorMessage = error.message;
  //       //resp({ type: "signup", status: "error", data: false, message: error });
  //     });
  //     //complete payment and create user object into database with new uid
  //     auth.onAuthStateChanged(function (user) {
  //       if (user) {
  //         // //user created and logged in ...
  //         // //build url...
  //         // var urlAWS = "https://ENTER-YOUR-LAMBA-URL-HERE?stripe=true";
  //         // urlAWS += "&uid=" + user.uid;
  //         // urlAWS += "&email=" + msg.e;
  //         // urlAWS += "&token=" + msg.tokenId;
  //         // chrome.storage.local.set({ authInfo: user });
  //         // //console.log('make call to lambda:', urlAWS);
  //         // try {
  //         //   //catch any errors
  //         //   fetch(urlAWS)
  //         //     .then((response) => {
  //         //       return response.json(); //convert to json for response...
  //         //     })
  //         //     .then((res) => {
  //         //       //update and create user obj
  //         //       firebase
  //         //         .database()
  //         //         .ref("/users/" + user.uid)
  //         //         .set({ stripeId: res });
  //         //       //success / update user / and return
  //         //       firebase
  //         //         .database()
  //         //         .ref("/users/" + user.uid)
  //         //         .once("value")
  //         //         .then(function (snapshot) {
  //         //           resp({
  //         //             type: "result",
  //         //             status: "success",
  //         //             data: user,
  //         //             userObj: snapshot.val(),
  //         //           });
  //         //         })
  //         //         .catch((result) => {
  //         //           chrome.storage.local.set({ authInfo: false });
  //         //           resp({ type: "result", status: "error", data: false });
  //         //         });
  //         //     })
  //         //     .catch((error) => {
  //         //       console.log(error, "error with payment?");
  //         //       chrome.storage.local.set({ authInfo: false });
  //         //       resp({ type: "result", status: "error", data: false });
  //         //     });
  //         // } catch (e) {
  //         //   console.log(error, "error with payment?");
  //         //   chrome.storage.local.set({ authInfo: false });
  //         //   resp({ type: "result", status: "error", data: false });
  //         // }
  //       }
  //     });
  //   }
  //   return Promise.resolve({ state: "OOOKK" });
  // });

  const saveTabs = async () => {
    const tabs = await browser.tabs.query({});
    const tabsToSave = tabs.map((tab) => {
      return { name: tab.title, url: tab.url, windowId: tab.windowId };
    });

    if (!auth.currentUser || !tabsToSave) {
      return;
    }

    await browser.storage.local.set({ tabs: tabsToSave });

    //TODO: move this to firebase lib
    const userId = auth.currentUser.uid;
    const browserId = await getBrowserId();
    const documentPath = `users/${userId}/tabdata/${browserId}`;
    const docRef = doc(db, documentPath);
    try {
      await setDoc(docRef, { data: tabsToSave });
    } catch (exception) {
      console.log(exception);
    }
  };

  // console.log("init authstatechange");
  // console.log("init auth current user", auth.currentUser);
  // auth.onAuthStateChanged(async (user) => {
  //   console.log("auth state change", user);
  //   console.log("auth current user", auth.currentUser);
  //   if (auth.currentUser) {
  //     const userId = auth.currentUser?.uid;
  //     const browserId = await getBrowserId();
  //     const documentPath = `users/${userId}/tabdata`;
  //     const docRef = collection(db, documentPath);

  //     //unsubscribe from prev
  //     prevSub();
  //     prevSub = onSnapshot(docRef, async (result) => {
  //       result.docChanges().forEach(async (changedDoc) => {
  //         console.log(" doc updated", changedDoc.doc.data());

  //         try {
  //           await browser.runtime.sendMessage({
  //             command: "doc-update",
  //             data: changedDoc.doc.data().data,
  //           });
  //         } catch {}
  //       });
  //     });
  //   } else {
  //     prevSub();
  //     prevSub = () => {};
  //   }
  // });
  // console.log("finished init");
} catch (exception) {
  //await browser.storage.local.set({ error: exception });
  console.log(exception);
}
