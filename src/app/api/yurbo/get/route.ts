import { db } from "../../../../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  orderBy,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getServerSession } from "next-auth";
import { ERRORS, getErrorMessage } from "@/app/constants/errors";
import { authOptions } from "../../auth/[...nextauth]/route";
import { LOGS } from "@/app/constants/logs";
import { Yurbo } from "@/types/types";

export async function GET() {
  function isYurbo(y: any): y is Yurbo {
    return y && "lat" in y && "long" in y && "name" in y && "created_at" in y;
  }

  try {
    const session = await getServerSession(authOptions);

    // no user found in session
    if (!session?.user?.email) {
      return Response.json(
        { success: false, mesage: ERRORS.UNATHORIZED },
        { status: 401 }
      );
    }

    // get yurbos for this user
    const yurbo_snapshot = await getDocs(
      query(
        collection(db, "users", session.user.email, "yurbos")
        // orderBy("timestamp", "desc")
      )
    );

    let yurbos: Yurbo[] = [];

    yurbo_snapshot.forEach((doc) => {
      const y = { id: doc.id, ...doc.data() };
      // console.log("yurbo y", y);
      if (y && isYurbo(y)) {
        yurbos.push(y);
      } else {
        console.error("datum is not assignable to a yurbo...", y);
      }
    });

    // return successful response
    console.log(LOGS.YURBO.GOT, "for user", session.user.email, yurbos);
    return Response.json({ yurbos });
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    console.error(ERRORS.YURBO.GOT, JSON.stringify({ message: errorMessage }));
    return Response.json(
      { mesage: errorMessage, success: false },
      { status: 500 }
    );
  }
}
