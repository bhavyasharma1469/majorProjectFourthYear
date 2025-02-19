const puppeteer = require('puppeteer');

async function scrapeJournalPublications() {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        // Navigate to the target page
        await page.goto('https://departments.nitj.ac.in/dept/cse/Faculty/6430447338bff038a7808e10', {
            waitUntil: 'networkidle2',
            timeout: 0,
        });

        console.log('Page loaded.');

        // Click the "Journal Publications" button
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('div.border.cursor-pointer'));
            const journalButton = buttons.find(b => b.textContent.trim() === 'Journal Publications');
            if (journalButton) journalButton.click();
        });

        console.log('Clicked on Journal Publications.');

        // Wait for the table to load
        await page.waitForSelector('table', { visible: true, timeout: 30000 });
        console.log('Table loaded.');

        // Select 100 from the dropdown to show all rows
        await page.select('#states', '100');
        console.log('Selected 100 rows per page from the dropdown.');

        // Wait for the table to update after selecting 100
        await page.waitForSelector('table', { visible: true, timeout: 30000 });
        console.log('Table updated with 100 rows.');

        // Extract data from the table
        const journalTableData = await page.evaluate(() => {
            const journalTable = document.querySelector('table');
            if (!journalTable) return [];

            const rows = Array.from(journalTable.querySelectorAll('tr'));
            return rows.slice(1).map(row => {
                const cells = Array.from(row.querySelectorAll('td'));
                return cells.map(cell => {
                    const link = cell.querySelector('a');
                    return link
                        ? { text: cell.textContent.trim(), link: link.href }
                        : cell.textContent.trim();
                });
            });
        });

        console.log('Extracted table data:', journalTableData);

        await browser.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

scrapeJournalPublications();

