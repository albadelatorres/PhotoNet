import { NextResponse } from "next/server";

import axios from "axios";

async function guardarLog(primaryEmail, tokenExpiry, token) {
  const BACKEND_BASE_API = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const res = await axios.post(`${BACKEND_BASE_API}/log`, {
      timestamp: new Date(), // Fecha y hora actual
      email: primaryEmail,   // Correo del usuario
      tokenExpiry,           // Fecha de expiración del token
      token                  // Token de acceso
    });

    if (res.status === 201) {
      console.log("Log creado en el backend:", res.data);
      return res.data; // Retorna el log creado
    } else {
      throw new Error("Error al crear el log en el backend");
    }
  } catch (error) {
    console.error("Error al guardar el log:", error.message);
    return null; // Opcional: Manejo del error
  }
}


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Código no encontrado" }, { status: 400 });
  }

  try {
    // Intercambia el código por un token de acceso
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return NextResponse.json({ error: "Error obteniendo token de acceso" }, { status: 400 });
    }

    // Usa el token de acceso para obtener datos del usuario
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userData) {
      return NextResponse.json({ error: "Error obteniendo datos del usuario" }, { status: 400 });
    }

    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const emails = await emailResponse.json();
    const primaryEmail = emails.find(email => email.primary)?.email || "No disponible";

    //llamar a log en el backend y guardar el log
    try {
      const tokenExpiry = new Date();
      const log = await guardarLog(primaryEmail, tokenExpiry, tokenData.access_token);
      if (log) {
        console.log("Log guardado correctamente:", log);
      }
    } catch (error) {
      console.error("Error al guardar el log:", error);
    }    


    const response = NextResponse.redirect("http://localhost:3000/");
    response.cookies.set("token", tokenData.access_token, { httpOnly: true });
    response.cookies.set("username", userData.login);
    response.cookies.set("email", primaryEmail);

    return response;

  } catch (error) {
    return NextResponse.json({ error: "Error en la autenticación" }, { status: 500 });
  }
}
