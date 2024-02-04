"use client";

/*
Form layout:
Event type (dropdown menu)
Number of players needed (slider) | (number of players present displayed next to it)
Desired Skill level (novice, intermediate, advanced, professional)
Start time
Additional Comments

These get displayed on map.
Click a pin on map, see number of people

todo:
how to store locations since all of them have to be public? should be posted into global bin


*/

import * as Yup from "yup";
import { FieldHookConfig, useField, useFormik } from "formik";
import { YUP } from "../../constants/constants";
import { Act, CreateYurboResponse } from "@/types/types";
import { getErrorMessgaeSuccess } from "@/app/constants/errors";
import { useEffect, useState } from "react";
import { Location } from "@/types/types";

interface Values {
  name: string;
  lat: number;
  long: number;
  act_id: string;
  desc: string;
}

const name = "name";
const label = "Name";

export default function Form() {
  // state for loading sign
  const [areCoordsLoading, setAreCoordsLoading] = useState(false);

  const [acts, setActs] = useState<Act[]>([]);

  const onSubmit = async (formikValues: Values) => {
    try {
      console.log("formik vals", formikValues);
      const res = await fetch("/api/yurbo/create", {
        method: "POST",
        body: JSON.stringify(formikValues),
      });
      const data: CreateYurboResponse = await res.json();

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
    initialValues: { name: "", lat: 0, long: 0, act_id: "", desc: "" },
    validationSchema: Yup.object().shape({
      [name]: Yup.string()
        .min(3, "Must be at least 3 characters")
        .required(YUP.REQUIRED),

      lat: Yup.number().required(YUP.REQUIRED),
      long: Yup.number().required(YUP.REQUIRED),
      act_id: Yup.string()
        .oneOf(
          acts.map((a) => a.id),
          "invalid event type"
        )
        .required(YUP.REQUIRED),
      desc: Yup.string(),
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

  const getActivities = async () => {
    try {
      const res = await fetch("/api/event/get");
      const act_json = await res.json();
      const acts = act_json.acts;
      setActs(acts);
    } catch (error) {
      console.log(
        "Error occured in Form component getting locations via API: ",
        error
      );
    }
  };

  useEffect(() => {
    getActivities();
  }, []);

  // useEffect(() => {
  //   const selectedLoc = acts.find((a) => a.id === formik.values.loc_id);
  //   if (selectedLoc) {
  //     formik.setFieldValue("long", selectedLoc.long);
  //     formik.setFieldValue("lat", selectedLoc.lat);
  //   }
  // }, [formik.values.loc_id]);

  return (
    <div className="2xs:w-4/5 xl:w-1/2 bg-blue-600">
      <form className="flex flex-col m-5" onSubmit={formik.handleSubmit}>
        <div className="flex flex-col w-full items-start my-5">
          <label htmlFor="location">{label} *</label>
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

        {/* ACTIVITY SELECTOR */}
        <div className="flex flex-col w-full items-start my-5">
          <label htmlFor="loc_id">Select the Activity:</label>

          <select id="act_id" {...formik.getFieldProps("act_id")}>
            <option value="">Select an Event Type</option>
            {acts.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <p
            className={`text-red-600 h-5 ${
              !formik.errors.act_id && "invisible"
            }`}
          >
            {formik.errors.act_id}
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
        <div className="flex flex-col w-full items-start my-5">
          <label htmlFor="lat">description </label>
          <input
            className="text-black text-left w-full h-1/3"
            id="desc"
            type="text"
            {...formik.getFieldProps("desc")}
          />
          <p
            className={`text-red-600 h-5 ${!formik.errors.lat && "invisible"}`}
          >
            {formik.errors.desc}
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
