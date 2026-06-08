import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import { writeFile, mkdir, readFile } from 'fs/promises';

type EmailConfig = {
  enabled: boolean;
  recipients: string[];
  smtpConfig: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
};

type ReporterOptions = {
  emailReport?: EmailConfig;
};

type TestStats = {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  failedTests: string[];
  duration: number; // Total duration in milliseconds
};

type SuiteStats = {
  feature: string;
  suiteName: string;
  stats: TestStats;
};

export default class TabularReporter implements Reporter {
  private suiteStats: Map<string, SuiteStats> = new Map();
  private startTime: number = 0;
  private options: ReporterOptions;

  constructor(options: ReporterOptions = {}) {
    this.options = options;
  }

  onBegin(config: FullConfig, suite: Suite) {
    this.startTime = Date.now();
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const fileKey = this.getFileKey(test);
    const feature = this.extractFeature(test.location.file);
    const suiteName = this.extractSuiteName(test);

    if (!this.suiteStats.has(fileKey)) {
      this.suiteStats.set(fileKey, {
        feature,
        suiteName,
        stats: { total: 0, passed: 0, failed: 0, skipped: 0, flaky: 0, failedTests: [], duration: 0 },
      });
    }

    const suiteData = this.suiteStats.get(fileKey)!;
    suiteData.stats.total++;
    suiteData.stats.duration += result.duration;

    if (result.status === 'passed') {
      suiteData.stats.passed++;
    } else if (result.status === 'failed') {
      suiteData.stats.failed++;
      suiteData.stats.failedTests.push(test.title);
    } else if (result.status === 'skipped') {
      suiteData.stats.skipped++;
    } else if (result.status === 'timedOut') {
      suiteData.stats.failed++;
      suiteData.stats.failedTests.push(test.title);
    }
  }

  async onEnd(result: FullResult) {
    console.log('\n');
    console.log('═'.repeat(100));
    console.log('  TEST EXECUTION SUMMARY');
    console.log('═'.repeat(100));
    console.log('');

    // Group by Feature
    const featureGroups = new Map<string, SuiteStats[]>();
    for (const suiteData of this.suiteStats.values()) {
      if (!featureGroups.has(suiteData.feature)) {
        featureGroups.set(suiteData.feature, []);
      }
      featureGroups.get(suiteData.feature)!.push(suiteData);
    }

    // Print table for each Feature
    for (const [feature, suites] of Array.from(featureGroups.entries()).sort()) {
      console.log(`\n📋 Feature: ${feature}`);
      console.log('─'.repeat(100));
      
      // Table header
      const header = [
        'Test Suite'.padEnd(40),
        'Total'.padStart(8),
        'Executed'.padStart(8),
        'Passed'.padStart(8),
        'Failed'.padStart(8),
        'Skipped'.padStart(8),
        'Duration'.padStart(12),
      ].join(' │ ');
      
      console.log(header);
      console.log('─'.repeat(110));

      // Table rows
      for (const suite of suites.sort((a, b) => a.suiteName.localeCompare(b.suiteName))) {
        const { stats, suiteName } = suite;
        
        const row = [
          suiteName.substring(0, 40).padEnd(40),
          stats.total.toString().padStart(8),
          stats.total.toString().padStart(8),
          stats.passed.toString().padStart(8),
          stats.failed.toString().padStart(8),
          stats.skipped.toString().padStart(8),
          this.formatDuration(stats.duration).padStart(12),
        ].join(' │ ');
        
        console.log(row);
      }
      
      console.log('─'.repeat(110));
    }

    // Overall summary
    const totalStats: TestStats = { total: 0, passed: 0, failed: 0, skipped: 0, flaky: 0, failedTests: [], duration: 0 };
    for (const suite of this.suiteStats.values()) {
      totalStats.total += suite.stats.total;
      totalStats.passed += suite.stats.passed;
      totalStats.failed += suite.stats.failed;
      totalStats.skipped += suite.stats.skipped;
      totalStats.duration += suite.stats.duration;
      totalStats.failedTests.push(...suite.stats.failedTests);
    }

    const totalExecutionTime = Date.now() - this.startTime;

    console.log('\n');
    console.log('═'.repeat(100));
    console.log('  OVERALL SUMMARY');
    console.log('═'.repeat(100));
    console.log('');
    console.log(`  ⏱️  Total Duration:  ${this.formatDuration(totalExecutionTime)}`);
    console.log(`  Total Tests:       ${totalStats.total}`);
    console.log(`  Executed:          ${totalStats.total}`);
    console.log(`  ✅ Passed:         ${totalStats.passed}`);
    console.log(`  ❌ Failed:         ${totalStats.failed}`);
    console.log(`  ⏭️  Skipped:        ${totalStats.skipped}`);
    console.log(`  Success Rate:      ${totalStats.total > 0 ? ((totalStats.passed / totalStats.total) * 100).toFixed(2) : 0}%`);
    console.log('');
    console.log('═'.repeat(100));
    console.log('\n');

    // Generate HTML summary report in test-results
    const htmlFilePath = await this.generateHtmlSummaryReport(featureGroups, totalStats, totalExecutionTime);
    
    // Send email with the report
    await this.sendEmailReport(htmlFilePath);
  }

  private getFileKey(test: TestCase): string {
    return test.location.file;
  }

  private extractFeature(filePath: string): string {
    if (filePath.includes('/login/') || filePath.includes('\\login\\')) return 'Login';
    if (filePath.includes('/order/') || filePath.includes('\\order\\')) return 'Order';
    if (filePath.includes('/products/') || filePath.includes('\\products\\')) return 'Products';
    if (filePath.includes('/cart/') || filePath.includes('\\cart\\')) return 'Cart';
    if (filePath.includes('/checkout/') || filePath.includes('\\checkout\\')) return 'Checkout';
    // Extract from filename if no folder match
    const fileName = filePath.split('/').pop()?.split('\\').pop()?.replace('.spec.ts', '');
    return fileName || 'Other';
  }

  private extractSuiteName(test: TestCase): string {
    const titlePath = test.titlePath();
    // titlePath structure: ['', 'browser', 'file', 'describe block', 'test name']
    // Find the first non-empty string that's not a file path and not a browser name
    for (const title of titlePath) {
      if (title && !title.includes('/') && !title.includes('\\') && !title.includes('.ts') && title !== 'chrome' && title !== 'firefox' && title !== 'webkit') {
        return title;
      }
    }
    // Fallback: extract from file name
    const fileName = test.location.file.split('/').pop()?.replace('.engage.ts', '').replace('.viewer.ts', '').replace('.ts', '');
    return fileName || 'Unknown Suite';
  }

  private async generateHtmlSummaryReport(featureGroups: Map<string, SuiteStats[]>, totalStats: TestStats, totalExecutionTime: number): Promise<string> {
    const successRate = totalStats.total > 0 ? ((totalStats.passed / totalStats.total) * 100).toFixed(2) : '0.00';
    
    let html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n`;
    html += `  <meta charset="UTF-8">\n`;
    html += `  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n`;
    html += `  <title>Engage Automation Test Execution Summary - ${new Date().toLocaleString()}</title>\n`;
    html += `  <style>\n`;
    html += `    * { margin: 0; padding: 0; box-sizing: border-box; }\n`;
    html += `    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; padding: 20px; }\n`;
    html += `    .container { max-width: 1200px; margin: 0 auto; }\n`;
    html += `    h1 { color: #333; border-bottom: 3px solid #4CAF50; padding-bottom: 10px; }\n`;
    html += `    h2 { color: #555; margin-top: 30px; background-color: #e8f5e9; padding: 10px; border-left: 4px solid #4CAF50; }\n`;
    html += `    table { width: 100%; border-collapse: collapse; margin: 20px 0; background-color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }\n`;
    html += `    th { background-color: #4CAF50; color: white; padding: 12px; text-align: left; font-weight: bold; }\n`;
    html += `    td { padding: 10px 12px; border-bottom: 1px solid #ddd; }\n`;
    html += `    tr:hover { background-color: #f5f5f5; }\n`;
    html += `    .summary-box { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }\n`;
    html += `    .summary-box h3 { color: #4CAF50; margin-bottom: 15px; }\n`;
    html += `    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }\n`;
    html += `    .summary-item { padding: 15px; background-color: #f9f9f9; border-radius: 5px; text-align: center; }\n`;
    html += `    .summary-item .label { font-size: 12px; color: #666; text-transform: uppercase; }\n`;
    html += `    .summary-item .value { font-size: 24px; font-weight: bold; color: #333; margin-top: 5px; }\n`;
    html += `    .passed { color: #4CAF50; font-weight: bold; }\n`;
    html += `    .failed { color: #f44336; font-weight: bold; }\n`;
    html += `    .skipped { color: #FF9800; font-weight: bold; }\n`;
    html += `    .text-center { text-align: center; }\n`;
    html += `    .timestamp { color: #999; font-size: 14px; margin-bottom: 20px; }\n`;
    html += `  </style>\n`;
    html += `</head>\n<body>\n`;
    html += `  <div class="container">\n`;
    html += `    <h1>Test Execution Summary</h1>\n`;
    html += `    <p class="timestamp">Generated: ${new Date().toLocaleString()}</p>\n`;

    // Overall summary box
    html += `    <div class="summary-box">\n`;
    html += `      <h3>Overall Summary</h3>\n`;
    html += `      <div class="summary-grid">\n`;
    html += `        <div class="summary-item"><div class="label">Total Duration</div><div class="value">${this.formatDuration(totalExecutionTime)}</div></div>\n`;
    html += `        <div class="summary-item"><div class="label">Total Tests</div><div class="value">${totalStats.total}</div></div>\n`;
    html += `        <div class="summary-item"><div class="label">Executed</div><div class="value">${totalStats.total}</div></div>\n`;
    html += `        <div class="summary-item"><div class="label">Passed</div><div class="value passed">${totalStats.passed}</div></div>\n`;
    html += `        <div class="summary-item"><div class="label">Failed</div><div class="value failed">${totalStats.failed}</div></div>\n`;
    html += `        <div class="summary-item"><div class="label">Skipped</div><div class="value skipped">${totalStats.skipped}</div></div>\n`;
    html += `        <div class="summary-item"><div class="label">Success Rate</div><div class="value">${successRate}%</div></div>\n`;
    html += `      </div>\n`;
    html += `    </div>\n`;

    // Feature-specific tables
    for (const [feature, suites] of Array.from(featureGroups.entries()).sort()) {
      html += `    <h2>Feature: ${feature}</h2>\n`;
      html += `    <table>\n`;
      html += `      <thead>\n`;
      html += `        <tr>\n`;
      html += `          <th>Test Suite</th>\n`;
      html += `          <th class="text-center">Total</th>\n`;
      html += `          <th class="text-center">Executed</th>\n`;
      html += `          <th class="text-center">Passed</th>\n`;
      html += `          <th class="text-center">Failed</th>\n`;
      html += `          <th class="text-center">Skipped</th>\n`;
      html += `          <th class="text-center">Duration</th>\n`;
      html += `        </tr>\n`;
      html += `      </thead>\n`;
      html += `      <tbody>\n`;

      for (const suite of suites.sort((a, b) => a.suiteName.localeCompare(b.suiteName))) {
        const { stats, suiteName } = suite;
        html += `        <tr>\n`;
        html += `          <td>${suiteName}</td>\n`;
        html += `          <td class="text-center">${stats.total}</td>\n`;
        html += `          <td class="text-center">${stats.total}</td>\n`;
        html += `          <td class="text-center passed">${stats.passed}</td>\n`;
        html += `          <td class="text-center failed">${stats.failed}</td>\n`;
        html += `          <td class="text-center skipped">${stats.skipped}</td>\n`;
        html += `          <td class="text-center">${this.formatDuration(stats.duration)}</td>\n`;
        html += `        </tr>\n`;
      }

      html += `      </tbody>\n`;
      html += `    </table>\n`;
    }

    html += `  </div>\n`;
    html += `</body>\n</html>`;

    // Write HTML report to test-results folder with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const fileName = `test_summary_${timestamp}.html`;
    const filePath = `test-results/${fileName}`;

    try {
      // Ensure test-results directory exists
      await mkdir('test-results', { recursive: true });
      await writeFile(filePath, html, 'utf-8');
      console.log(`✅ Test summary report created: ${filePath}`);
      return filePath;
    } catch (error) {
      console.error('❌ Failed to create test summary report:', error);
      return '';
    }
  }

  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      const remainingMinutes = minutes % 60;
      const remainingSeconds = seconds % 60;
      return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${seconds}s`;
    }
  }

  private async sendEmailReport(htmlFilePath: string): Promise<void> {
    const emailConfig = this.options.emailReport;
    
    if (!emailConfig?.enabled) {
      console.log('📧 Email reporting is disabled. Set emailReport.enabled to true in playwright.config.ts to enable.');
      return;
    }

    if (!htmlFilePath) {
      console.log('⚠️  Skipping email - no report file generated');
      return;
    }

    if (!emailConfig.recipients || emailConfig.recipients.length === 0) {
      console.log('⚠️  Skipping email - no recipients configured');
      return;
    }

    try {
      const nodemailer = await import('nodemailer');
      const htmlContent = await readFile(htmlFilePath, 'utf-8');
      const timestamp = new Date().toLocaleString();
      
      // Create transporter
      const transporter = nodemailer.default.createTransport(emailConfig.smtpConfig);
      
      // Send email
      const info = await transporter.sendMail({
        from: emailConfig.smtpConfig.auth.user,
        to: emailConfig.recipients.join(', '),
        subject: `Engage Automation Test Results - ${timestamp}`,
        html: htmlContent,
      });
      
      console.log(`✅ Email sent successfully to: ${emailConfig.recipients.join(', ')}`);
      console.log(`   Message ID: ${info.messageId}`);
    } catch (error: any) {
      console.error('❌ Failed to send email report:', error.message);
      console.log('📧 Report file available at:', htmlFilePath);
      console.log('💡 Tip: Ensure nodemailer is installed (npm install nodemailer) and SMTP credentials are correct.');
    }
  }
}