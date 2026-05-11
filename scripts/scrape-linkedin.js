import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function scrapeLinkedIn() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 720 }
    });

    // Inject session cookie for multiple domains
    const cookieValue = 'AQEDAR6o4n4CtkOqAAABm0fB398AAAGcbldYzFYAYvCayaKwSUgRJeZYgbMbKfV7X2GN-QZMd0N7ZxvKrPsO3HLNahh5rxNQY-OqrtAK1x-AtdiZDrb2QOUq4oZzgvu3jPp-s9m1bgqVRBXdRmyQ-xXu';
    await context.addCookies([
        { name: 'li_at', value: cookieValue, domain: '.linkedin.com', path: '/' },
        { name: 'li_at', value: cookieValue, domain: 'www.linkedin.com', path: '/' }
    ]);

    const page = await context.newPage();

    console.log('Navigating to Polarisigl LinkedIn...');

    try {
        const targetUrl = 'https://www.linkedin.com/company/polarisigl/posts/';
        console.log(`Navaging to ${targetUrl}...`);

        await page.goto(targetUrl, {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });

        await page.waitForTimeout(10000);

        const currentUrl = page.url();
        console.log(`Current URL after navigation: ${currentUrl}`);

        const content = await page.content();
        console.log(`Content length: ${content.length}`);

        await page.screenshot({ path: 'public/data/debug-scrape.png' });
        console.log('Screenshot saved to public/data/debug-scrape.png');

        const title = await page.title();
        console.log(`Page Title: ${title}`);

        // Check for specific login elements
        const isLoginPage = currentUrl.includes('login') || currentUrl.includes('checkpoint');
        console.log(`Is Login Page: ${isLoginPage}`);

        // Log the first 1000 chars of the body to see what we are dealing with
        const bodySnippet = await page.evaluate(() => document.body.innerText.substring(0, 1000));
        console.log('Body Snippet:', bodySnippet);

        console.log('Extracting posts...');

        const posts = await page.evaluate(() => {
            const postElements = Array.from(document.querySelectorAll('.feed-shared-update-v2, .update-components-article')).slice(0, 5);

            return postElements.map((el, index) => {
                // Content/Caption
                const contentEl = el.querySelector('.feed-shared-update-v2__description-wrapper, .update-components-text, .feed-shared-text');
                const content = contentEl ? contentEl.innerText.trim() : 'No content available';

                // Image
                const imgEl = el.querySelector('.feed-shared-image__container img, .update-components-image__image, img.ivm-view-attr__img--centered');
                const image = imgEl ? imgEl.src : 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=800';

                // Link
                const linkEl = el.querySelector('a.feed-shared-update-v2__link-wrapper, a.update-components-article__link');
                let link = linkEl ? linkEl.href : 'https://www.linkedin.com/company/polarisigl';
                if (link.includes('linkedin.com/sharing/')) link = 'https://www.linkedin.com/company/polarisigl';

                // Date (Approximate)
                const dateEl = el.querySelector('.update-components-actor__subtext, .feed-shared-actor__sub-text');
                const dateRaw = dateEl ? dateEl.innerText.split('•')[0].trim() : 'Recent Update';

                return {
                    id: `lp${index + 1}`,
                    date: dateRaw,
                    content: content.length > 200 ? content.substring(0, 197) + '...' : content,
                    image,
                    link
                };
            });
        });

        console.log(`Successfully extracted ${posts.length} posts.`);

        const dataPath = path.join(process.cwd(), 'public', 'data', 'linkedin-posts.json');
        fs.writeFileSync(dataPath, JSON.stringify(posts, null, 2));
        console.log(`Data saved to ${dataPath}`);

    } catch (error) {
        console.error('Error during scraping:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

scrapeLinkedIn();
