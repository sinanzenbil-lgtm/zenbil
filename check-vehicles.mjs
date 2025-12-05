import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkVehicles() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        locations: {
          include: {
            location: true
          }
        }
      }
    });
    
    console.log('Total vehicles:', vehicles.length);
    console.log('\nVehicle details:');
    
    for (const vehicle of vehicles) {
      console.log(`\n${vehicle.brand} ${vehicle.model} (${vehicle.plate})`);
      console.log(`  Active: ${vehicle.isActive}`);
      console.log(`  Locations: ${vehicle.locations.length}`);
      
      if (vehicle.locations.length === 0) {
        console.log('  ⚠️  NO LOCATIONS! This vehicle won\'t show up in searches!');
      } else {
        vehicle.locations.forEach(vl => {
          console.log(`    - ${vl.location.name}`);
        });
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkVehicles();

