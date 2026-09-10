const supplierAHotels = async () => {
  return [
    { hotelId: 'a1', name: 'Ocean Pearl', city: 'San Diego', supplier: 'Supplier A', price: 180, commissionPct: 20 },
    { hotelId: 'a2', name: 'Palm Ridge', city: 'Miami', supplier: 'Supplier A', price: 250, commissionPct: 25 },
    { hotelId: 'a3', name: 'Luna Stay', city: 'Seattle', supplier: 'Supplier A', price: 210, commissionPct: 22 },
    { hotelId: 'a4', name: 'Azure Vista', city: 'Austin', supplier: 'Supplier A', price: 160, commissionPct: 18 },
    { hotelId: 'a5', name: 'Mountain Hive', city: 'Denver', supplier: 'Supplier A', price: 130, commissionPct: 15 },
    { hotelId: 'a6', name: 'Delhi Heritage', city: 'Delhi', supplier: 'Supplier A', price: 220, commissionPct: 24 }
  ];
};

const supplierBHotels = async () => {
  return [
    { hotelId: 'b1', name: 'Ocean Pearl', city: 'San Diego', supplier: 'Supplier B', price: 160, commissionPct: 16 },
    { hotelId: 'b2', name: 'Palm Ridge', city: 'Miami', supplier: 'Supplier B', price: 220, commissionPct: 22 },
    { hotelId: 'b3', name: 'Luna Stay', city: 'Seattle', supplier: 'Supplier B', price: 170, commissionPct: 17 },
    { hotelId: 'b4', name: 'Azure Vista', city: 'Austin', supplier: 'Supplier B', price: 140, commissionPct: 14 },
    { hotelId: 'b5', name: 'Park Court', city: 'Nashville', supplier: 'Supplier B', price: 100, commissionPct: 10 },
    { hotelId: 'b6', name: 'Delhi Heritage', city: 'Delhi', supplier: 'Supplier B', price: 205, commissionPct: 20 }
  ];
};

module.exports = {
  supplierAHotels,
  supplierBHotels
};

 