import { fixture, html } from '@open-wc/testing';

import { sendMouse, setViewport } from '@web/test-runner-commands';

import { visualDiff } from '@web/test-runner-visual-regression';

import { baseStyle } from './base-visual.js';

import { substationDoc } from '../substation.testfiles.js';

import './bay-editor.js';
import type { BayEditor } from './bay-editor.js';

const factor = window.process && process.env.CI ? 4 : 2;
function timeout(ms: number) {
  return new Promise(res => {
    setTimeout(res, ms * factor);
  });
}
mocha.timeout(2000 * factor);

const style = document.createElement('style');
style.textContent = baseStyle;
document.body.prepend(style);

describe('Component for SCL element Bay ', () => {
  describe('with add menu open', () => {
    let editor: BayEditor;
    beforeEach(async () => {
      const bay = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`Bay[name="testBay1"]`)!;

      editor = await fixture(
        html`<bay-editor .element=${bay} ?showfunctions=${true}></bay-editor>`,
      );
      document.body.style.width = '300';
      document.body.style.height = '500';
      editor.style.position = 'absolute';
      editor.style.top = '20';
      editor.style.left = '20';
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 300, height: 500 });
      await sendMouse({ type: 'click', position: [260, 20] });

      await editor.updateComplete;
      await timeout(600);
      await visualDiff(document.body, `bay-editor/#1 add menu visible`);
    });
  });

  describe('with showfunction false', () => {
    let editor: BayEditor;
    beforeEach(async () => {
      const bay = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`Bay[name="testBay2"]`)!;

      editor = await fixture(html`<bay-editor .element=${bay}></bay-editor>`);
      document.body.style.width = '400';
      document.body.style.height = '800';
      editor.style.position = 'absolute';
      editor.style.top = '20';
      editor.style.left = '20';
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 400, height: 600 });
      await sendMouse({ type: 'click', position: [50, 80] });

      await editor.updateComplete;
      await timeout(600);
      await visualDiff(
        document.body,
        `bay-editor/#2 Unfocused with showfunction=false`,
      );
    });
  });

  describe('with showfunction true', () => {
    let editor: BayEditor;
    beforeEach(async () => {
      const bay = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`Bay[name="testBay2"]`)!;

      editor = await fixture(
        html`<bay-editor .element=${bay} ?showfunctions=${true}></bay-editor>`,
      );
      document.body.style.width = '400';
      document.body.style.height = '2000';
      editor.style.position = 'absolute';
      editor.style.top = '20';
      editor.style.left = '20';
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 400, height: 800 });

      await sendMouse({ type: 'click', position: [120, 240] });

      await timeout(600);
      await visualDiff(
        document.body,
        `bay-editor/#3 Focused with showfunction=true`,
      );
    });
  });
});
