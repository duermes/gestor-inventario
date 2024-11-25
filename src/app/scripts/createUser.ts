import bcrypt from "bcrypt";
import prisma from "../lib/db";

export async function createUser() {
  const email = "admin@admin.com";
  const password = "Admin123$";
  const name = "Lorena";
  const lastName = "Kim";
  const role = "ADMIN";

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        lastName,
        password: hashedPassword,
        role: role,
        isActive: true,
      },
    });

    console.log("Usuario creado exitosamente:", user);
  } catch (error) {
    console.error("Error al crear el usuario:", error);
  }
}
