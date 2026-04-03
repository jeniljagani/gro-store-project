const http = require('http');

const cats = ['Fruits', 'Dairy', 'Snacks', 'Beverages', 'Personal Care'];

cats.forEach(cat => {
    const url = `http://localhost:5000/api/products?category=${encodeURIComponent(cat)}`;
    http.get(url, r => {
        let d = '';
        r.on('data', c => d += c);
        r.on('end', () => {
            try {
                const j = JSON.parse(d);
                console.log(`${cat}: ${j.products.length} products`);
                if (j.products.length > 0) {
                    console.log(`  First: ${j.products[0].name} (${j.products[0].category})`);
                }
            } catch (e) {
                console.log(`${cat}: ERROR - ${d.substring(0, 100)}`);
            }
        });
    });
});
