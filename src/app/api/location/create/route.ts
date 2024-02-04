import { getServerSession } from "next-auth";
import { CreateLocationRequest } from "@/types/types";
import { authOptions } from "../../auth/[...nextauth]/route";
import { doc, setDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { LOGS } from "@/app/constants/logs";
import { ERRORS, getErrorMessage } from "@/app/constants/errors";

export async function POST(request: CreateLocationRequest) {
  const body = await request.json();

  const { name, lat, long } = body; // js destructuring

  try {
    const session = await getServerSession(authOptions);

    // no user found in session
    if (!session?.user?.email) {
      return Response.json(
        { success: false, message: ERRORS.UNATHORIZED },
        { status: 401 }
      );
    }

    const docRef = doc(
      collection(db, "users", session.user.email, "locations")
    );

    // add new personal yurbo
    await setDoc(docRef, {
      name,
      lat,
      long,
    });

    // return successful response
    console.log(LOGS.LOCATION.CREATED, name, lat, long);
    return Response.json(
      { message: LOGS.LOCATION.CREATED, success: true, name, lat, long },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    console.error(
      ERRORS.LOCATION.CREATED,
      JSON.stringify({ message: errorMessage, name, lat, long })
    );
    return Response.json(
      { mesage: errorMessage, success: false, name, lat, long },
      { status: 500 }
    );
  }
}
