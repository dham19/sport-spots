"use client";

import * as Yup from "yup";
import { useFormik } from "formik";
import { YUP } from "../../constants/constants";
import { CreateLocationResponse, CreateYurboResponse } from "@/types/types";
import { getErrorMessgaeSuccess } from "@/app/constants/errors";
import { useState } from "react";

interface Values {
  name: string;
  lat: number;
  long: number;
}

const name = "name";
const label = "Location";

export default function Form() {
  // state for loading sign
  const [areCoordsLoading, setAreCoordsLoading] = useState(false);

  const onSubmit = async (formikValues: Values) => {
    try {
      const res = await fetch("/api/location/create", {
        method: "POST",
        body: JSON.stringify(formikValues),
      });
      const data: CreateLocationResponse = await res.json();

      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      alert(
        JSON.stringify(
          { ...formikValues, ...getErrorMessgaeSuccess(error) },
          null,
          2
        )
      );
    }
  };

  const formik = useFormik<Values>({
    initialValues: { [name]: "", lat: 0, long: 0 },
    validationSchema: Yup.object().shape({
      [name]: Yup.string()
        .min(3, "Must be at least 3 characters")
        .required(YUP.REQUIRED),

      lat: Yup.number().required(YUP.REQUIRED),
      long: Yup.number().required(YUP.REQUIRED),
    }),
    onSubmit,
  });

  // fill in the form fields with current location
  const getLoc = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);

      formik.setFieldValue("long", position.coords.longitude);
      formik.setFieldValue("lat", position.coords.latitude);
    });
  };

  return (
    <div className="2xs:w-4/5 xl:w-1/2 bg-blue-600">
      <form className="flex flex-col m-5" onSubmit={formik.handleSubmit}>
        <div className="flex flex-col w-full items-start my-5">
          <label htmlFor="name">{label} *</label>
          <input
            className="text-black text-left w-1/4"
            id={name}
            type="text"
            placeholder={`Enter ${label}`}
            {...formik.getFieldProps(name)}
          />
          <p
            className={`text-red-600 h-5 ${
              !formik.errors[name] && "invisible"
            }`}
          >
            {formik.errors[name]}
          </p>
        </div>
        {/* Lat input */}
        <div className="flex flex-col w-full items-start my-5">
          <label htmlFor="lat">latitude *</label>
          <input
            className="text-black text-left w-1/4"
            id="lat"
            type="text"
            {...formik.getFieldProps("lat")}
          />
          <p
            className={`text-red-600 h-5 ${!formik.errors.lat && "invisible"}`}
          >
            {formik.errors.lat}
          </p>
        </div>

        {/* Long Input */}
        <div className="flex flex-col w-full items-start my-5">
          <label htmlFor="long">longitude *</label>
          <input
            className="text-black text-left w-1/4"
            id="long"
            type="text"
            {...formik.getFieldProps("long")}
          />
          <p
            className={`text-red-600 h-5 ${!formik.errors.long && "invisible"}`}
          >
            {formik.errors.long}
          </p>
        </div>

        {/* Autofill current coordinates */}
        <button
          className="btn-primary m-auto mb-2"
          type="button"
          onClick={getLoc}
        >
          Current coords
        </button>

        <button className="btn-primary m-auto" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
