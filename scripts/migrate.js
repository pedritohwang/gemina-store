const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function migrate() {
  const dbPath = path.join(__dirname, '../data/db.json');
  if (!fs.existsSync(dbPath)) {
    console.log("No db.json found to migrate.");
    return;
  }

  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  console.log("Starting migration...");

  // 1. Categories
  if (data.categories) {
    console.log("Migrating categories...");
    for (const catName of data.categories) {
      await prisma.category.upsert({
        where: { name: catName },
        update: {},
        create: { name: catName }
      });
    }
  }

  // 2. Brand Config
  if (data.brandInfo) {
    console.log("Migrating brand info...");
    await prisma.brandConfig.upsert({
      where: { id: "singleton" },
      update: data.brandInfo,
      create: { ...data.brandInfo, id: "singleton" }
    });
  }

  // 3. FAQ
  if (data.faq) {
    console.log("Migrating FAQ...");
    await prisma.fAQ.deleteMany({});
    await prisma.fAQ.createMany({
      data: data.faq.map(f => ({
        title: f.title,
        content: f.content
      }))
    });
  }

  // 4. Banners
  if (data.banners) {
    console.log("Migrating banners...");
    for (const banner of data.banners) {
      await prisma.banner.create({
        data: { image: banner.image }
      });
    }
  }

  // 5. Products
  if (data.products) {
    console.log("Migrating products...");
    for (const p of data.products) {
      await prisma.product.create({
        data: {
          name: p.name,
          description: p.description,
          price: parseFloat(p.price),
          category: p.category,
          stock: parseInt(p.stock) || 0,
          colors: typeof p.colors === 'string' ? p.colors : JSON.stringify(p.colors),
          images: typeof p.images === 'string' ? p.images : JSON.stringify(p.images),
          sizeTable: typeof p.sizeTable === 'string' ? p.sizeTable : JSON.stringify(p.sizeTable),
          isNewCollection: p.isNewCollection || false
        }
      });
    }
  }

  // 6. Users
  if (data.users) {
    console.log("Migrating users...");
    for (const u of data.users) {
      await prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: {
          email: u.email,
          password: u.password,
          role: u.role,
          name: u.name,
          address: u.address,
          phone: u.phone,
          province: u.province,
          transport: u.transport
        }
      });
    }
  }

  console.log("Migration finished successfully!");
}

migrate()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
