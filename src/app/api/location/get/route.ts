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
  function isLocation(l: any): l is Location {
    return l && "name" in l && "lat" in l && "long" in l;
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
    const act_snapshot = await getDocs(
      query(
        collection(db, "users", session.user.email, "locations")
        // orderBy("timestamp", "desc")
      )
    );

    // convert snapshot into list of Acts, making sure they are assignable to Act
    let locations: Location[] = [];

    act_snapshot.forEach((doc) => {
      const l = { id: doc.id, ...doc.data() };
      if (isLocation(l)) {
        locations.push(l);
      } else {
        console.error("datum is not assignable to a location...", l);
      }
    });

    // return successful response
    console.log(LOGS.LOCATION.GOT, "for user", session.user.email, locations);
    return Response.json({ locations });
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    console.error(
      ERRORS.LOCATION.GOT,
      JSON.stringify({ message: errorMessage })
    );
    return Response.json(
      { mesage: errorMessage, success: false },
      { status: 500 }
    );
  }
}
