import { Yurbo } from "@/types/types";
import MapboxMap from "../components/MapboxMap";
import { ERRORS, getErrorMessage } from "../constants/errors";

import { db } from "../../firebase";
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
  Timestamp,
} from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { LOGS } from "@/app/constants/logs";

// extrapolated logic from api... need to fix caching
async function getYurbos() {
  // Type guard function (know if this is right!)
  function isYurbo(y: any): y is Yurbo {
    return (
      y &&
      "lat" in y &&
      "long" in y &&
      "name" in y &&
      "email" in y &&
      "description" in y &&
      "event_id" in y
    );
  }
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json(
        { success: false, mesage: ERRORS.UNATHORIZED },
        { status: 401 }
      );
    }

    // get yurbos for this user
    const yurbo_snapshot = await getDocs(query(collection(db, "events")));

    let yurbos: Yurbo[] = [];

    // populate yurbos array. Not sure whats the best way to do type stuff but i tried
    yurbo_snapshot.forEach((doc) => {
      const y = { id: doc.id, ...doc.data() };
      console.log("a yurb", y);
      // ensure data exists && is a Yurbo before pushing
      if (isYurbo(y)) {
        yurbos.push(y);
      } else {
        console.error("A datum does not conform to Yurbo interface:", y);
      }
    });

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

export default async function Map() {
  let mapbox_token = process.env.MAPBOX_PUBLIC_TOKEN;

  const res = await getYurbos();
  const data = await res.json(); // had to split these into two awaits
  const yurbos = data.yurbos;

  console.log("Yurboooos", yurbos);

  //   make sure types are correct
  if (mapbox_token === undefined) {
    console.log("Token is undefined ..");
    mapbox_token = "";
  }

  return (
    <div className="flex h-screen">
      {/* Left Screen: List of Yurbos */}
      <div className="hidden sm:block md:w-1/2 md:h-screen md:pt-16 md:ml-5">
        <div className="flex flex-row justify-between mr-5 border-b mb-2 pb-1">
          <h2 className="font-bold text-lg">Your Yurbos</h2>
          <h2 className="font-bold">Coordinates</h2>
          <h2 className="font-bold">Starts</h2>
        </div>

        <ul>
          {yurbos?.map((y: Yurbo) => (
            <div
              key={y.lat.toString() + y.long.toString()}
              className="flex flex-row justify-between"
            >
              <li key={"loc " + y.name} className="">
                {y.name}
              </li>
              <li key={"coord " + y.lat} className="pr-2">
                {y.lat} x {y.long}
              </li>
              {y.start_time && (
                <li key={y.name} className="pr-4">
                  {new Date(y.start_time.seconds * 1000).toLocaleDateString()}
                </li>
              )}
            </div>
          ))}
        </ul>
      </div>

      {/* Right Screen: Map */}
      <div className="h-full w-full md:w-1/2">
        <MapboxMap mapboxToken={mapbox_token} yurbos={yurbos} />
      </div>
    </div>
  );
}
