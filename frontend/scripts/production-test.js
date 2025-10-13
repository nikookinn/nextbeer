#!/usr/bin/env node

/**
 * Production Readiness Test Script
 * Checks if the application is ready for production deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('NextBeer Production Readiness Test\n');

let hasErrors = false;
const errors = [];
const warnings = [];

// Test 1: Check for console.log in production files
console.log('1. Checking for console.log statements...');
const srcDir = path.join(rootDir, 'src');
const checkConsoleLog = (dir) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      checkConsoleLog(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        if (line.includes('console.log') && !line.includes('process.env.NODE_ENV === \'development\'')) {
          warnings.push(`Console.log found in ${filePath}:${index + 1}`);
        }
      });
    }
  });
};

checkConsoleLog(srcDir);

if (warnings.length > 0) {
  console.log('Warnings found:');
  warnings.forEach(warning => console.log(`   ${warning}`));
} else {
  console.log('No console.log statements found');
}

// Test 2: Check environment files
console.log('\n2. Checking environment configuration...');
const envProdPath = path.join(rootDir, '.env.production');
const envExamplePath = path.join(rootDir, '.env.example');

if (!fs.existsSync(envProdPath)) {
  errors.push('Missing .env.production file');
  hasErrors = true;
} else {
  console.log('.env.production exists');
}

if (!fs.existsSync(envExamplePath)) {
  warnings.push('Missing .env.example file');
} else {
  console.log('.env.example exists');
}

// Test 3: Check security headers
console.log('\n3. Checking security configuration...');
const headersPath = path.join(rootDir, 'public', '_headers');

if (!fs.existsSync(headersPath)) {
  errors.push('Missing security headers file (public/_headers)');
  hasErrors = true;
} else {
  console.log('Security headers file exists');
}

// Test 4: Check build configuration
console.log('\n4. Checking build configuration...');
const viteConfigPath = path.join(rootDir, 'vite.config.ts');

if (!fs.existsSync(viteConfigPath)) {
  errors.push('Missing vite.config.ts');
  hasErrors = true;
} else {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  
  if (!viteConfig.includes('minify')) {
    warnings.push('Minification not configured in vite.config.ts');
  }
  
  if (!viteConfig.includes('manualChunks')) {
    warnings.push('Manual chunks not configured for optimal caching');
  }
  
  console.log('Vite configuration exists');
}

// Test 5: Check TypeScript configuration
console.log('\n5. Checking TypeScript configuration...');
const tsconfigPath = path.join(rootDir, 'tsconfig.json');

if (!fs.existsSync(tsconfigPath)) {
  errors.push('Missing tsconfig.json');
  hasErrors = true;
} else {
  console.log('TypeScript configuration exists');
}

// Test 6: Check package.json scripts
console.log('\n6. Checking package.json scripts...');
const packageJsonPath = path.join(rootDir, 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  errors.push('Missing package.json');
  hasErrors = true;
} else {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const scripts = packageJson.scripts || {};
  
  const requiredScripts = ['build', 'build:production', 'lint', 'type-check'];
  requiredScripts.forEach(script => {
    if (!scripts[script]) {
      warnings.push(`Missing script: ${script}`);
    }
  });
  
  console.log('Package.json exists');
}

// Test 7: Check for ErrorBoundary
console.log('\n7. Checking error handling...');
const errorBoundaryPath = path.join(srcDir, 'components', 'common', 'ErrorBoundary.tsx');

if (!fs.existsSync(errorBoundaryPath)) {
  warnings.push('ErrorBoundary component not found');
} else {
  console.log('ErrorBoundary component exists');
}

// Test 8: Check API configuration
console.log('\n8. Checking API configuration...');
const baseApiPath = path.join(srcDir, 'api', 'baseApi.ts');

if (!fs.existsSync(baseApiPath)) {
  errors.push('Missing base API configuration');
  hasErrors = true;
} else {
  const baseApiContent = fs.readFileSync(baseApiPath, 'utf8');
  
  if (!baseApiContent.includes('baseQueryWithReauth')) {
    warnings.push('Token refresh mechanism not found in API configuration');
  }
  
  console.log('Base API configuration exists');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log(' Production Readiness Summary');
console.log('='.repeat(50));

if (hasErrors) {
  console.log('ERRORS FOUND:');
  errors.forEach(error => console.log(`   • ${error}`));
  console.log('\nApplication is NOT ready for production!');
  process.exit(1);
} else {
  console.log('No critical errors found');
}

if (warnings.length > 0) {
  console.log('\n WARNINGS:');
  warnings.forEach(warning => console.log(`   • ${warning}`));
  console.log('\n💡 Consider addressing warnings for optimal production deployment');
}

console.log('\n Application appears ready for production deployment!');
console.log('\n Next steps:');
console.log('   1. Run: npm run build:production');
console.log('   2. Test the built application: npm run preview');
console.log('   3. Deploy the dist/ folder to your hosting service');
console.log('   4. Update environment variables for production');
console.log('   5. Monitor application performance and errors');

process.exit(0);
