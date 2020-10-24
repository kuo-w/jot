import firebase from "firebase";
import "firebase/firestore";
import { FIREBASE_CONFIG_CREDENTIALS } from "../credentials";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";

/*
 * [oct 20, 2020]
 * https://github.com/firebase/firebase-js-sdk/issues/2655
 * Using firebase version <=7.9.0 throws an error:
 *   `INTERNAL UNHANDLED ERROR:  TypeError: __PRIVATE_protoLoader.HP is not a function`
 *
 * Fixed by updating package version.
 * Note: installing via `expo install firebase` may install failing version.
 */

interface Dto {
  createdAt: firebase.firestore.Timestamp;
  text: string;
  userid: string;
  guid?: string;
}

(async () => {
  console.log("STARTING");

  firebase.initializeApp(FIREBASE_CONFIG_CREDENTIALS);
  const db = firebase.firestore();

  const docsRef = db.collection("/jots");

  const snapshot = await docsRef.get();

  let numCompleted = 0;
  let numSkipped = 0;
  const skippedItems = new Array<Dto>();

  const tasks = snapshot.docs.map(
    async (doc: firebase.firestore.DocumentData) => {
      const item = <Dto>doc.data();
      if (item.guid != null) {
        numSkipped++;
        skippedItems.push(item);
        return;
      }

      item.guid = uuidv4();
      await db.collection("/jots").doc(doc.id).set(item);
      console.log(`Done: ${doc.id}`);
      numCompleted += 1;
    }
  );

  await Promise.all(tasks);

  try {
    await fs.promises.writeFile("./data.json", JSON.stringify(skippedItems));
    console.log("SUCCESSFULLY WROTE DATA TO FILES.");
  } catch (error) {
    console.error(error);
  }

  console.info(`\nALL DONE\nCOMPLETED ${numCompleted}\nSKIPPED ${numSkipped}`);
  process.exit();
})();
