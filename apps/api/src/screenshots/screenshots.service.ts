import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { chromium, Browser } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ScreenshotsService {
  private readonly logger = new Logger(ScreenshotsService.name);
  private readonly screenshotDir: string;

  constructor(private configService: ConfigService) {
    // Default to ./screenshots in the api root
    this.screenshotDir =
      this.configService.get<string>('SCREENSHOT_DIR') || './screenshots';

    // Ensure directory exists
    const absoluteDir = path.resolve(process.cwd(), this.screenshotDir);
    if (!fs.existsSync(absoluteDir)) {
      fs.mkdirSync(absoluteDir, { recursive: true });
    }
  }

  async captureScreenshot(url: string, websiteId: string): Promise<string> {
    this.logger.log(`Capturing screenshot for URL: ${url}`);
    let browser: Browser | null = null;

    try {
      browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      });

      const page = await context.newPage();

      // Navigate to the page and wait for domcontentloaded (much faster)
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });

      // Small delay to allow initial styles/images to settle
      await page.waitForTimeout(500);

      const fileName = `${websiteId}-${Date.now()}.png`;
      const absoluteDir = path.resolve(process.cwd(), this.screenshotDir);
      const filePath = path.join(absoluteDir, fileName);

      // Capture full page screenshot
      await page.screenshot({ path: filePath, fullPage: true });

      this.logger.log(`Screenshot saved successfully: ${filePath}`);

      // Return the relative URL path for the frontend to access
      return `/screenshots/${fileName}`;
    } catch (error) {
      this.logger.error(`Failed to capture screenshot for ${url}:`, error);
      throw new Error(
        `Gagal mengambil screenshot: ${(error as Error).message}`,
      );
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
  async saveUploadedFile(
    file: Express.Multer.File,
    websiteId: string,
  ): Promise<string> {
    const fileName = `${websiteId}-manual-${Date.now()}${path.extname(file.originalname) || '.png'}`;
    const absoluteDir = path.resolve(process.cwd(), this.screenshotDir);
    const filePath = path.join(absoluteDir, fileName);
    await fs.promises.writeFile(filePath, file.buffer);
    this.logger.log(`Manual screenshot saved successfully: ${filePath}`);
    return `/screenshots/${fileName}`;
  }
}
