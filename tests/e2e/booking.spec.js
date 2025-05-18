            const { test, expect } = require('@playwright/test');

            // Define the base URL of your application.  Use a config value
            const baseURL = 'http://localhost:5000'; //  Replace with your actual base URL, or even better, load from config

            test.describe('Booking Flow E2E Tests', () => {
              // Before each test, navigate to the booking page.  Adjust the path as needed.
              test.beforeEach(async ({ page }) => {
                await page.goto(`${baseURL}/`); //  <-  Change this
              });

              test('should create a booking successfully', async ({ page }) => {
                // 1. Navigate to the booking form (if it's on a separate page)
                // await page.click('a[href="/book-a-session"]'); // Example: Click a link

                // 2. Fill out the booking form
                await page.fill('input[name="name"]', 'John Doe');
                await page.fill('input[name="email"]', 'john.doe@example.com');
                await page.fill('input[name="date"]', '2024-07-28');
                await page.fill('input[name="time"]', '10:00');
                await page.selectOption('select[name="timezone"]', 'America/New_York');
                await page.fill('input[name="topic"]', 'Consultation');
                await page.fill('textarea[name="message"]', 'Need help with setup and deployment.');
                // Select a service (assuming you have a way to select services, adjust as needed)
                await page.click('input[type="checkbox"][value="1"]'); // Example: Select service with value "1"

                // 3. Submit the form
                await page.click('button[type="submit"]'); // Or the appropriate selector

                // 4. Assert the success message.  Adjust the selector to match your page.
                await expect(page.locator('div[role="alert"]')).toContainText('Booking created successfully');

                // 5.  (Optional) Assert URL change.
                // await expect(page).toHaveURL('/booking-confirmation');
              });

              // Add more E2E tests for other booking scenarios, e.g.,
              // - Trying to submit with invalid data
              // - Checking form validation messages
              // - Testing different service selections
            });
            