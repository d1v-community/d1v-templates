const { spawn } = require('child_process');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const kill = require('tree-kill');

const templatesBase = '/Users/apple/project/d1v_sever/d1v-templates/industries';
const outDir = '/Users/apple/project/d1v_sever/d1v-templates/images';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// recursively find all directories containing package.json
function getTemplates(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === '.next') continue;
    
    const filePath = path.join(dir, file);
    try {
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) {
        if (fs.existsSync(path.join(filePath, 'package.json'))) {
          results.push(filePath);
        } else {
          results = results.concat(getTemplates(filePath));
        }
      }
    } catch (e) {}
  }
  return results;
}

const templates = getTemplates(templatesBase);

async function runTemplate(templatePath) {
  const name = path.basename(templatePath);
  console.log(`\n\nStarting template: ${name} (${templatePath})`);
  
  return new Promise((resolve, reject) => {
    console.log(`Running pnpm install for ${name}...`);
    const installChild = spawn('pnpm', ['install'], {
      cwd: templatePath,
      env: process.env,
      shell: true
    });

    installChild.on('close', (code) => {
      console.log(`pnpm install exited with code ${code}. Starting dev...`);
      
      const child = spawn('pnpm', ['dev'], {
        cwd: templatePath,
        env: process.env,
        shell: true,
        detached: true
      });

      let url = null;
      let browser = null;
      let timeoutId = null;

      child.stdout.on('data', async (data) => {
        const output = data.toString();
        process.stdout.write(output);
        
        const match = output.match(/Local:\s+(http:\/\/localhost:\d+\/?)/) || output.match(/(http:\/\/localhost:\d+\/?)/);
        if (match && !url) {
          url = match[1];
          console.log(`\nDetected URL: ${url}`);
          
          try {
            browser = await puppeteer.launch({ headless: 'new' });
            const page = await browser.newPage();
            await page.setViewport({ width: 1920, height: 1080 });
            
            console.log(`Navigating to ${url}...`);
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 }).catch(e => console.log('Navigation error:', e.message));
            
            await new Promise(r => setTimeout(r, 6000)); // wait for animations
            
            const outFile = path.join(outDir, `${name}.png`);
            await page.screenshot({ path: outFile, fullPage: true });
            console.log(`Saved screenshot for ${name} to ${outFile}`);
            
          } catch (err) {
            console.error(`Error screenshotting ${name}:`, err);
          } finally {
            if (browser) await browser.close();
            console.log(`Killing process for ${name}...`);
            if (timeoutId) clearTimeout(timeoutId);
            
            try {
              process.kill(-child.pid, 'SIGKILL');
            } catch(e) {}
            resolve();
          }
        }
      });

      child.stderr.on('data', (data) => {
        process.stdout.write(data.toString());
      });

      timeoutId = setTimeout(() => {
        if (!url) {
          console.log(`Timeout waiting for URL for ${name}. Killing...`);
          try {
            process.kill(-child.pid, 'SIGKILL');
          } catch(e) {}
          resolve();
        }
      }, 25000); // 25 seconds to start
    });
  });
}

async function main() {
  for (const template of templates) {
    if (template.includes('node_modules')) continue;
    await runTemplate(template);
  }
  console.log('\nAll done!');
}

main().catch(console.error);
