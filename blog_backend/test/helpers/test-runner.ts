#!/usr/bin/env node

import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

interface TestSuite {
  name: string;
  pattern: string;
  timeout: number;
}

class TestRunner {
  private readonly testSuites: TestSuite[] = [
    {
      name: 'Unit Tests - Auth Service',
      pattern: 'test/auth/*.e2e-spec.ts',
      timeout: 30000,
    },
    {
      name: 'E2E Tests - Auth Controller',
      pattern: 'test/auth/auth.controller.e2e-spec.ts',
      timeout: 60000,
    },
    {
      name: 'Unit Tests - Posts Service',
      pattern: 'test/posts/posts.service.e2e-spec.ts',
      timeout: 30000,
    },
    {
      name: 'E2E Tests - Posts Controller',
      pattern: 'test/posts/posts.controller.e2e-spec.ts',
      timeout: 60000,
    },
    {
      name: 'Unit Tests - Comments Service',
      pattern: 'test/comments/comments.service.e2e-spec.ts',
      timeout: 30000,
    },
    {
      name: 'E2E Tests - Comments Controller',
      pattern: 'test/comments/comments.controller.e2e-spec.ts',
      timeout: 60000,
    },
    {
      name: 'E2E Tests - Users Controller',
      pattern: 'test/users/users.controller.e2e-spec.ts',
      timeout: 60000,
    },
  ];

  private results: Array<{
    suite: string;
    passed: boolean;
    duration: number;
    output: string;
  }> = [];

  async runAllTests(
    options: { parallel?: boolean; coverage?: boolean } = {},
  ): Promise<void> {
    console.log('🚀 Starting comprehensive test suite...\n');

    if (options.parallel) {
      await this.runTestsInParallel();
    } else {
      await this.runTestsSequentially();
    }

    this.generateReport();
  }

  private async runTestsSequentially(): Promise<void> {
    for (const suite of this.testSuites) {
      await this.runSingleTestSuite(suite);
    }
  }

  private async runTestsInParallel(): Promise<void> {
    const promises = this.testSuites.map((suite) =>
      this.runSingleTestSuite(suite),
    );
    await Promise.all(promises);
  }

  private async runSingleTestSuite(suite: TestSuite): Promise<void> {
    console.log(`📋 Running: ${suite.name}`);
    const startTime = Date.now();

    try {
      const output = await this.executeJest(suite.pattern, suite.timeout);
      const duration = Date.now() - startTime;

      this.results.push({
        suite: suite.name,
        passed: true,
        duration,
        output,
      });

      console.log(`✅ ${suite.name} - Passed (${duration}ms)\n`);
    } catch (error) {
      const duration = Date.now() - startTime;

      this.results.push({
        suite: suite.name,
        passed: false,
        duration,
        output: error instanceof Error ? error.message : String(error),
      });

      console.log(`❌ ${suite.name} - Failed (${duration}ms)\n`);
    }
  }

  private executeJest(pattern: string, timeout: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const jestArgs = [
        '--config=test/jest-e2e.json',
        '--testPathPattern=' + pattern,
        '--timeout=' + timeout,
        '--verbose',
        '--detectOpenHandles',
        '--forceExit',
      ];

      const jest = spawn('npx', ['jest', ...jestArgs], {
        stdio: 'pipe',
        shell: true,
      });

      let output = '';
      let errorOutput = '';

      jest.stdout.on('data', (data) => {
        output += data.toString();
      });

      jest.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      jest.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(
            new Error(
              `Jest failed with code ${code}:\n${errorOutput}\n${output}`,
            ),
          );
        }
      });

      jest.on('error', (error) => {
        reject(error);
      });
    });
  }

  private generateReport(): void {
    const totalTests = this.results.length;
    const passedTests = this.results.filter((r) => r.passed).length;
    const failedTests = totalTests - passedTests;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(50));
    console.log(`📋 Total Test Suites: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`⏱️  Total Duration: ${totalDuration}ms`);
    console.log(
      `📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`,
    );

    if (failedTests > 0) {
      console.log('\n❌ FAILED TESTS:');
      console.log('-'.repeat(30));
      this.results
        .filter((r) => !r.passed)
        .forEach((result) => {
          console.log(`\n🔸 ${result.suite}:`);
          console.log(
            result.output.substring(0, 500) +
              (result.output.length > 500 ? '...' : ''),
          );
        });
    }

    // Generate JSON report
    this.generateJSONReport();

    if (failedTests === 0) {
      console.log(
        '\n🎉 All tests passed! Your backend is ready for deployment.',
      );
    } else {
      console.log(
        `\n⚠️  ${failedTests} test suite(s) failed. Please review and fix before deployment.`,
      );
      process.exit(1);
    }
  }

  private generateJSONReport(): void {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.length,
        passed: this.results.filter((r) => r.passed).length,
        failed: this.results.filter((r) => !r.passed).length,
        duration: this.results.reduce((sum, r) => sum + r.duration, 0),
      },
      results: this.results,
    };

    const reportPath = path.join(process.cwd(), 'test-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }
}

// CLI execution
if (require.main === module) {
  const runner = new TestRunner();
  const args = process.argv.slice(2);

  const options = {
    parallel: args.includes('--parallel'),
    coverage: args.includes('--coverage'),
  };

  runner.runAllTests(options).catch((error) => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}

export { TestRunner };
