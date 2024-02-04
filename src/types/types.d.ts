import { Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

interface GenericResponse {
  success: boolean;
  message: string;
}

declare interface GenericError extends Error, GenericResponse {}

declare interface GenericFormFieldComponent<T> extends T {
  id: string;
  label: string;
  error: string | undefined;
}

declare interface GenericFormField<T> {
  yup: Yup.Object;
  initialValue: T;
  Component: React.ComponentType<GenericFormFieldComponent<T>>;
}

declare interface GenericFormProps<> {
  fields: GenericFormField[];
  onSubmit: FormEventHandler<HTMLFormElement>;
}

/* Create Event Types  */
declare interface CreateEventRequest extends NextRequest {
  body: { eventName: string };
}

declare interface CreateEventResponse extends GenericResponse {
  eventName: string;
}

declare interface CreateEventError extends GenericError {
  eventName: string;
}

/* Create Yurbo Types  */
declare interface CreateYurboRequest extends NextRequest {
  body: { location: string; lat: number; long: number };
}

declare interface CreateYurboResponse extends GenericResponse {
  location: string;
}

declare interface CreateYurboError extends GenericError {
  location: string;
}

/* Get Yurbo Types */
declare interface GetYurbosResponse extends GenericResponse {
  yurbos: Yurbo[];
}

declare interface GetYurbosError extends GenericError {
  yurbos: Yurbo[];
}

// Location class, for grouping yurbos together
declare interface Location {
  id: string;
  name: string;
  lat: number;
  long: number;
}

/* Class for a Yurbo */
declare interface Yurbo {
  id: string;
  email: string;
  start_time: Timestamp;
  act_id: string;
  name: string;
  lat: number;
  long: number;
  description: string;
}

/* Class for Event/Activity */
declare interface Act {
  id: string;
  name: string;
}

/* Create Location Types  */
declare interface CreateLocationRequest extends NextRequest {
  body: { name: string; lat: number; long: number };
}

declare interface CreateLocationResponse extends GenericResponse {
  name: string;
}

declare interface CreateLocationError extends GenericError {
  name: string;
}

// // Class for markers
// declare interface Marks {
//   name: string;
//   lat: number;
//   long: number;
// }

/*

declare interface GenericFormFieldComponent
  extends HTMLProps<HTMLInputElement> {
  id: string;
  label: string;
  error: string | undefined;
}

declare interface GenericFormField<T> {
  yup: Yup.Object;
  Component: React.ComponentType<GenericFormFieldComponent>;
}

declare interface GenericFormProps<> {
  fields: GenericFormField[];
  onSubmit: FormEventHandler<HTMLFormElement>;
}


*/
