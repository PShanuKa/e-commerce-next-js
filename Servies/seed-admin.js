import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@shoplk.com";
  const passwordHash = await bcrypt.hash("admin123", 10);

  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    const adminUser = await prisma.user.create({
      data: {
        name: "Super Admin",
        email,
        passwordHash,
        phone: "0712345678",
        role: "admin",
        isActive: true,
      },
    });
    console.log(`✅ Admin created: ${adminUser.email}`);
  } else {
    const updated = await prisma.user.update({
      where: { email },
      data: { role: "admin" },
    });
    console.log(
      `✅ Admin already existed. Role ensured to be admin: ${updated.email}`,
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
