import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { userValidation, validation } from "@/app/middleware";

export async function POST(req) {
  try {
    const { isUserValid, authError } = await userValidation();
    if (!isUserValid) {
      return NextResponse.json(authError, { status: 401 });
    }
    const { valid, body, error } = await validation(req);
    if (!valid) {
      return NextResponse.json(error.message, { status: 400 });
    } else {
      const {
        contactName,
        contactEmailAddress,
        contactPhoneNumber,
        contactAddress,
        createdDate,
      } = body;
      await sql`INSERT INTO 
          contacts(contact_name,contact_email,contact_phone,contact_address,contact_timezone) 
          VALUES(${contactName},${contactEmailAddress},${contactPhoneNumber},${contactAddress},${createdDate});`;
      return NextResponse.json(
        { message: "Inserted Successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
