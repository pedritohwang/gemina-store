const { PrismaClient } = require("../src/generated/client");
const prisma = new PrismaClient();

async function main() {
  const products = [
    { 
      name: "Top Torzado", 
      price: 7700, 
      category: "Tops", 
      description: "Un top torzado elegante y moderno, diseñado para resaltar tu figura con comodidad.",
      images: JSON.stringify(["https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&q=80&w=800"]),
      stock: 50,
      colors: JSON.stringify(["#E3D5CA", "#2D2D2D", "#FFFFFF"])
    },
    { 
      name: "Manga Larga con Frunce", 
      price: 12000, 
      category: "Remeras", 
      description: "Remera de manga larga con detalles de frunces que aportan un toque femenino.",
      images: JSON.stringify(["https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800"]),
      stock: 30,
      colors: JSON.stringify(["#7A7A7A", "#2D2D2D"])
    },
    { 
      name: "Pollera Lara", 
      price: 15500, 
      category: "Polleras", 
      description: "La pollera Lara es un clásico reinventado. Corte impecable.",
      images: JSON.stringify(["https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800"]),
      stock: 20,
      colors: JSON.stringify(["#D4C3B3", "#2D2D2D"])
    },
    { 
      name: "Body Cuello Cuadrado", 
      price: 9300, 
      category: "Bodys", 
      description: "Body con cuello cuadrado, un básico esencial que estiliza el escote.",
      images: JSON.stringify(["https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&q=80&w=800"]),
      stock: 45,
      colors: JSON.stringify(["#2D2D2D", "#FFFFFF"])
    },
  ];

  console.log("Cargando productos iniciales...");
  
  for (const p of products) {
    await prisma.product.create({
      data: p
    });
  }

  console.log("¡Hecho! Los productos ya están en la base de datos.");

  console.log("Creando usuario administrador...");
  await prisma.user.upsert({
    where: { email: "admin@gemina.com" },
    update: {},
    create: {
      email: "admin@gemina.com",
      password: "admin123", // En producción deberías usar bcrypt
      role: "ADMIN",
      name: "Administrador Gémina"
    }
  });
  console.log("Admin creado: admin@gemina.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
