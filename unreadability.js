#!/usr/bin/env node

import { join, isAbsolute } from 'path';
import { readFile, writeFile } from 'node:fs/promises';
import { cwd } from 'node:process';
import { program  } from 'commander';
import { JSDOM } from 'jsdom';
import { ease } from 'readability-meter';

const rel = (pth) => new URL(pth, import.meta.url);
const relCWD = (pth) => join(cwd(), pth);
const { version } = JSON.parse(await readFile(rel('./package.json')));

program
  .name('unreadability')
  .description('Decorate an HTML file with readability scoring')
  .version(version)
  .option('--w3c', 'work on a W3C doc')
  .argument('<input>', 'the input HTML file')
  .argument('<output>', 'the output HTML file')
  .action(async (input, output, { w3c }) => {
    input = normalisePath(input);
    output = normalisePath(output);
    const dom = new JSDOM(await readFile(input));
    const { window: { document }} = dom;
    Array.from(document.querySelectorAll('p, li, dd, div')).forEach(el => {
      if (w3c) {
        if (el.closest('#toc-nav, div.head, #toc, div.header-wrapper, #back-to-top, [role="navigation"], #references, #issue-summary, #bp-summary')) return;
      }
      const txt = el.textContent
        .replace(/\s+/g, ' ')
        .replace(/(?:^\s+|\s+$)/g, '')
      ;
      if (!txt) return;
      if (w3c && txt.length < 50) return;
      let { score, schoolLevel } = ease(txt);
      // the code really isn't great
      if (score < 0) schoolLevel = 'college graduate';
      if (score > 100) schoolLevel = '5th grade';
      const ru = document.createElement('robin-unreadability');
      ru.setAttribute('score', score);
      ru.setAttribute('school-level', schoolLevel);
      el.insertBefore(ru, el.firstChild);
    });
    const script = document.createElement('script');
    script.textContent = await readFile(rel('injected-script.js'));
    document.body.appendChild(script);
    await writeFile(output, dom.serialize(), 'utf-8');
  })
;
program.parse();

function normalisePath (pth) {
  if (isAbsolute(pth)) return pth;
  return relCWD(pth);
}
