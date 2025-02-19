const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const port = 5000; // You can choose any available port

app.use(cors()); // For cross-origin requests from frontend
app.use(express.json()); // To parse JSON body from frontend

// Define the scraping route
app.post('/scrape', async (req, res) => {
    const { url } = req.body; // Extract the URL sent by frontend

    if (!url) {
        return res.status(400).json({ success: false, error: "URL is required" });
    }

    try {
        // Launch Puppeteer browser
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        // Go to the target URL sent by the frontend
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        // Click on 'Journal Publications' (with a wait to ensure it appears)
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('div.border.cursor-pointer'));
            const journalButton = buttons.find(b => b.textContent.trim() === 'Journal Publications');
            if (journalButton) journalButton.click();
        });

        // Wait for the table to load (we can also wait for some specific selector here)
        await page.waitForSelector('table', { visible: true });

        // Select 100 rows per page from the dropdown
        await page.select('#states', '100');
        
        // Wait for the table again to ensure it's loaded after selection
        await page.waitForSelector('table', { visible: true });

        // Scrape the table data
        const tableData = await page.evaluate(() => {
            const table = document.querySelector('table');
            if (!table) return [];
            const rows = Array.from(table.querySelectorAll('tr')).slice(1); // Skip the header row
            return rows.map(row => {
                const cells = Array.from(row.querySelectorAll('td'));
                return cells.map(cell => {
                    const link = cell.querySelector('a');
                    return link ? { text: cell.textContent.trim(), link: link.href } : cell.textContent.trim();
                });
            });
        });

        // Close the browser
        await browser.close();

        // Respond with the scraped data
        res.json({ success: true, data: tableData });
    } catch (error) {
        // Log and send error response
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
