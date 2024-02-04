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
import { Act } from "@/types/types";

export async function GET() {
  function isAct(a: any): a is Act {
    return a && "name" in a;
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

    // get acts for this user
    const act_snapshot = await getDocs(query(collection(db, "activities")));

    // convert snapshot into list of Acts, making sure they are assignable to Act
    let acts: Act[] = [];

    act_snapshot.forEach((doc) => {
      const a = { id: doc.id, ...doc.data() };
      if (isAct(a)) {
        acts.push(a);
      } else {
        console.error("datum is not assignable to an activity...", a);
      }
    });

    // return successful response
    console.log(LOGS.EVENT.GOT, "for user", session.user.email, acts);
    return Response.json({ acts });
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
