const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });
    
    page.on('pageerror', err => {
        errors.push(err.message);
    });
    
    try {
        await page.goto(`file://${process.cwd()}/index.html`);
        await page.waitForTimeout(2000);
        
        // Test basic functionality
        const title = await page.title();
        console.log('Page title:', title);
        
        // Check if main elements exist
        const logoExists = await page.$('.logo');
        console.log('Logo exists:', !!logoExists);
        
        const settingsBtnExists = await page.$('#settingsBtn');
        console.log('Settings button exists:', !!settingsBtnExists);
        
        const urlInputExists = await page.$('#urlInput');
        console.log('URL input exists:', !!urlInputExists);
        
        const runBtnExists = await page.$('#runAnalysis');
        console.log('Run analysis button exists:', !!runBtnExists);
        
        // Check for external resources
        const scripts = await page.$$eval('script[src]', scripts => scripts.map(s => s.src));
        console.log('External scripts loaded:', scripts.length);
        
        if (errors.length > 0) {
            console.log('\nConsole errors found:');
            errors.forEach(err => console.log(' -', err));
        } else {
            console.log('\nNo console errors found');
        }
        
        console.log('\nTest completed successfully!');
    } catch (err) {
        console.error('Test failed:', err.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
